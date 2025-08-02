import { Expense } from './../Travel';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient, injectQuery } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { TravelService } from '../Travel.service';
import { SelectModule } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ClientsService } from '../../MyClients/clients.service';
import { DriversService } from '../../Drivers/driver.service';
import { from } from 'rxjs';
import { TruckServiceService } from '../../Trucks/TruckService.service';
import { TableModule } from 'primeng/table';
import { format } from 'path';

interface newTravel {
  travelCode: string;
  destination: string;
  noIVAmount: number;
  withIVAmount: number;
  travelDate: string;
  driver_id: number;
  truck_plate: string;
  client_id: number;
  ExcludeIVA: number;
}

@Component({
  selector: 'app-NewTravelModal',
  templateUrl: './NewTravelModal.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePicker,
    SelectModule,
    InputNumber,
    CheckboxModule,
    TableModule,
  ],
  providers: [DatePipe],
})
export class NewTravelModalComponent implements OnInit {
  queryClient = inject(QueryClient);
  travelForm: FormGroup;
  expenseForm: FormGroup;
  truckService = inject(TruckServiceService);
  clientService = inject(ClientsService);
  driverService = inject(DriversService);

  constructor(
    private dialogRef: DialogRef<NewTravelModalComponent>,
    private travelService: TravelService,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.travelForm = this.fb.group({
      travelCode: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      travelDate: ['', [Validators.required]],
      driver_id: ['', [Validators.required]],
      truck_plate: ['', [Validators.required]],
      client_id: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      isWithIV: [false],
      ExcludeIVA: [false],
      expenses: [[]],
    });
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      mount: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.travelForm.invalid) {
      return;
    }
    if (this.expenseForm.valid) {
      this.addExpens();
    }

    const travel = this.travelForm.value;
    const formattedDate = this.datePipe.transform(
      travel.travelDate,
      'yyyy-MM-dd'
    );
    travel.travelDate = formattedDate;
    travel.noIVAmount = travel.isWithIV ? null : travel.amount;
    travel.withIVAmount = travel.isWithIV ? travel.amount : null;

    from(this.travelService.addTravel(travel))
      .pipe(
        this.toast.observe({
          loading: 'Añadiendo transporte, por favor espere...',
          success: () => {
            this.closeModal();
            this.queryClient.invalidateQueries({ queryKey: ['travels'] });
            return 'Transporte agregado correctamente!';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al agregar el transporte: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {});
  }
  closeModal() {
    this.dialogRef.close();
  }

  async addExpens() {
    const expenFormValue = this.expenseForm.value;
    const formattedDate = this.datePipe.transform(
      expenFormValue.date,
      'yyyy-MM-dd'
    );
    expenFormValue.date = formattedDate;
    const expenses = this.travelForm.get('expenses')?.value || [];
    expenses.push(expenFormValue);
    this.travelForm.patchValue({ expenses });
    this.expenseForm.reset();
  }

  async removeExpense(index: number) {
    const expenses = [...this.travelForm.get('expenses')?.value];
    expenses.splice(index, 1);
    this.travelForm.patchValue({ expenses });
  }

  truckList = injectQuery(() => ({
    queryKey: ['truck-complete'],
    queryFn: () => this.truckService.getTrucksList(),
  }));

  clientList = injectQuery(() => ({
    queryKey: ['client-complete'],
    queryFn: () => this.clientService.getClientList(),
  }));

  driverList = injectQuery(() => ({
    queryKey: ['drivers-complete'],
    queryFn: () => this.driverService.getDriversList(),
  }));

  ngOnInit() {
    this.travelForm.get('isWithIV')?.valueChanges.subscribe((value) => {
      if (value) {
        this.travelForm
          .get('ExcludeIVA')
          ?.setValue(false, { emitEvent: false });
      }
    });
    this.travelForm.get('ExcludeIVA')?.valueChanges.subscribe((value) => {
      if (value) {
        this.travelForm.get('isWithIV')?.setValue(false, { emitEvent: false });
      }
    });
  }
}
