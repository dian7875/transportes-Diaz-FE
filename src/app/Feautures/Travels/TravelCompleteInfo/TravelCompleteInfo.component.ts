import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Travel } from '../Travel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { TravelExpensComponent } from '../travelExpens/travelExpens.component';

@Component({
  selector: 'app-TravelCompleteInfo',
  templateUrl: './TravelCompleteInfo.component.html',
  imports: [TableModule, CommonModule],
})
export class TravelCompleteInfoComponent {
  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public travel: Travel,
    private dialog: Dialog
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  openExpensModal() {}

  openExpensesModal() {
    this.dialog.open(TravelExpensComponent, {
      data: {
        expenses: this.travel.expenses,
        withIVAmount: this.travel.IVAmount + this.travel.noIVAmount,
      },
      width: '600px',
    });
  }
}
