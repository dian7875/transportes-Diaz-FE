import { ExpensesService } from './../../Expens/Expenses/Expenses.service';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumber } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { from } from 'rxjs';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-add-TravelExpens',
  templateUrl: './add-TravelExpens.component.html',
  imports: [
    Button,
    TableModule,
    InputNumber,
    CommonModule,
    DatePickerModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class AddTravelExpensComponent {
  expenseForm: FormGroup;
  expensesList: FormGroup;
  queryClient = inject(QueryClient);
  expensesService = inject(ExpensesService);

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    @Inject(DIALOG_DATA)
    public data: { truck_plate: string; travel_id: number },
    private dialogRef: DialogRef<AddTravelExpensComponent>,
    private datePipe: DatePipe
  ) {
    this.expensesList = this.fb.group({
      travel_id: [data.travel_id],
      truck_plate: [data.truck_plate],
      expenses: [[], [Validators.minLength(1)]],
    });
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      mount: ['', Validators.required],
    });
  }

  async addExpens() {
    const expenFormValue = this.expenseForm.value;
    const formattedDate = this.datePipe.transform(
      expenFormValue.date,
      'yyyy-MM-dd'
    );
    expenFormValue.date = formattedDate;
    const expenses = this.expensesList.get('expenses')?.value || [];
    expenses.push(expenFormValue);
    this.expensesList.patchValue({ expenses });
    this.expenseForm.reset();
  }

  async removeExpense(index: number) {
    const expenses = [...this.expensesList.get('expenses')?.value];
    expenses.splice(index, 1);
    this.expensesList.patchValue({ expenses });
  }

  closeModal() {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.expensesList.get('expenses')?.value.length < 1) {
      if(this.expenseForm.valid){
        this.addExpens()
      } else{
        this.toast.info('Debe añadir almenos un gasto');
        return;
      }
    }

    const expens = this.expensesList.value;

    from(this.expensesService.addExpenses(expens))
      .pipe(
        this.toast.observe({
          loading: 'Añadiendo gastos, por favor espere...',
          success: () => {
            this.closeModal();
            this.queryClient.invalidateQueries({ queryKey: ['travels'] });
            return 'Gastos agregados correctamente!';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al agregar los gastos: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {});
  }
}
