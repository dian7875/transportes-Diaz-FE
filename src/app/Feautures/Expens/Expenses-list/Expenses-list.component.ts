import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ExpensesService } from '../Expenses/Expenses.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TotalNewExpenseComponent } from '../TotalNewExpense/TotalNewExpense.component';
import { TruckServiceService } from '../../Trucks/TruckService.service';

@Component({
  selector: 'app-Expenses-list',
  templateUrl: './Expenses-list.component.html',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputGroupModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    DatePicker,

  ],
  providers: [DatePipe],
})
export class ExpensesListComponent {
  constructor(private dialog: Dialog) {}

  displayedColumns: string[] = ['mount', 'name', 'date', 'truck_plate'];
  selectedExpense: any[] = [];
  metaKey: boolean = false;
  expenseService = inject(ExpensesService);
  truckService = inject(TruckServiceService)

  currentPage = signal(1);
  plate = signal('');
  date = signal<Date | null>(null);
  endDate = signal<Date | null>(new Date());

  expenses = injectQuery(() => ({
    queryKey: ['expenses', this.currentPage(), this.plate(), this.date()],
    queryFn: () =>
      this.expenseService.getExpenses(this.currentPage(), {
        plate: this.plate(),
        date: this.date() ?? undefined,
        endDate: this.date() ?? undefined,
      }),
  }));

  truckList = injectQuery(() => ({
    queryKey: ['truck-complete'],
    queryFn: () =>
      this.truckService.getTrucksList(),
  }));

  loadExpenses() {
    const filters = {
      plate: this.plate(),
      startDate: this.date(),
      endDate: this.endDate(),
    };
  }

  openModal() {
    this.dialog.open(TotalNewExpenseComponent);
  }

  loadPage(page: number) {
    this.currentPage.set(page);
  }
}
