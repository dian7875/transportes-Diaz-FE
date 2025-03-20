import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { ExpensesListComponent } from '../Expenses-list/Expenses-list.component';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-Expenses',
  templateUrl: './Expenses.component.html',
  imports: [
    CommonModule,
    ExpensesListComponent,
  ],
})
export class ExpensesComponent {

}
