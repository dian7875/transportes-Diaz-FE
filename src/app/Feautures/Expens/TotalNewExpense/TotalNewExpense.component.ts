import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { ExpensesService } from '../Expenses/Expenses.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { TruckServiceService } from '../../Trucks/TrucksList/TruckService.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectModule } from 'primeng/select';

interface NewExpense {
  mount: number;
  name: string;
  date: string;
  truck_plate: string;
}

@Component({
  selector: 'app-TotalNewExpense',
  templateUrl: './TotalNewExpense.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePicker,

    InputGroupModule,
    FormsModule,
    SelectModule,
    DatePicker,
  ],

  providers: [DatePipe],
})
export class TotalNewExpenseComponent {
  queryCLient = inject(QueryClient);
  expensForm: FormGroup;
  truckService = inject(TruckServiceService);

  constructor(
    private dialog: Dialog,
    private dialogRef: DialogRef<TotalNewExpenseComponent>,
    @Inject(DIALOG_DATA) public data: { plate: string },
    private expenseService: ExpensesService,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.expensForm = this.fb.group({
      truck_plate: ['', Validators.required],
      mount: ['', [Validators.required]],
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  mutation = injectMutation(() => ({
    mutationFn: (expen: NewExpense) => this.expenseService.addExpense(expen),
    onSuccess: () => {
      this.queryCLient.invalidateQueries({ queryKey: ['Expens'] });
    },
  }));

  async onSubmit() {
    if (this.expensForm.invalid) {
      return;
    }
    const expen = this.expensForm.value;

    const formattedDate = this.datePipe.transform(expen.date, 'yyyy-MM-dd');
    expen.date = formattedDate;

    try {
      this.mutation.mutate(expen);
      this.toast.success('Gasto agregado con exito');
      this.closeModal();
    } catch (error) {
      console.error('Error al agregar el gasto', error);
    }
  }

  truckList = injectQuery(() => ({
    queryKey: ['truck-complete'],
    queryFn: () => this.truckService.getTrucksList(),
  }));

  closeModal() {
    this.dialogRef.close();
  }

 
}
