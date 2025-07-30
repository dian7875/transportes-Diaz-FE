import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Travel } from './../../Travels/Travel';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-travel-invoice-list',
  templateUrl: './travel-invoice-list.component.html',
  imports: [TableModule, CommonModule],
})
export class TravelInvoiceListComponent {
  dialogRef = inject(DialogRef);
  data = inject(DIALOG_DATA) as { travels: Travel[] };
}
