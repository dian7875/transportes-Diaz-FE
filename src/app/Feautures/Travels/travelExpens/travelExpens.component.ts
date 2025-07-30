import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-travelExpens',
  templateUrl: './travelExpens.component.html',
  imports: [CommonModule, TableModule],
})
export class TravelExpensComponent {
  
  dialogRef = inject(DialogRef);
  data = inject(DIALOG_DATA) as { expenses: any[]; withIVAmount: number };

  get expenses() {
    return this.data.expenses || [];
  }

  get totalExpenses(): number {
    return this.expenses.reduce((acc, e) => acc + (e.mount || 0), 0);
  }

  get remaining(): number {
    return (this.data.withIVAmount || 0) - this.totalExpenses;
  }
}
