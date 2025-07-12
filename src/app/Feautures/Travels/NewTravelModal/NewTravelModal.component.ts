import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  QueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
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

interface newTravel {
  travelCode: string;
  destination: string;
  noIVAmount: number;
  withIVAmount: number;
  travelDate: string;
  driver_id: number;
  truck_plate: string;
  client_id: number;
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
  ],
  providers: [DatePipe],
})
export class NewTravelModalComponent implements OnInit {
  queryClient = inject(QueryClient);
  travelForm: FormGroup;
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
    });
  }

  async onSubmit() {
    if (this.travelForm.invalid) {
      return;
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
      .subscribe(() => {

      });
  }
  closeModal() {
    this.dialogRef.close();
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

  ngOnInit() {}
}
