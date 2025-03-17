import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { ExpensesService } from '../Expenses/Expenses.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePicker } from 'primeng/datepicker';

interface Expenses {
  mount: number;
  name: string;
  date: string;
  truck_plate: string;
}

@Component({
  selector: 'app-NewExpensesModal',
  templateUrl: './NewExpensesModal.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DatePicker],
  providers: [DatePipe],
})
export class NewExpensesModalComponent {
  queryCLient = inject(QueryClient);
  expensForm: FormGroup;

  constructor(
    private dialogRef: DialogRef<NewExpensesModalComponent>,
    @Inject(DIALOG_DATA) public data: { plate: string },
    private expenseService: ExpensesService,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.expensForm = this.fb.group({
      truck_plate: [this.data.plate],
      mount: ['', [Validators.required]],
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  mutation = injectMutation(() => ({
    mutationFn: (expen: Expenses) => this.expenseService.addExpense(expen),
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

  closeModal() {
    this.dialogRef.close();
  }
}
