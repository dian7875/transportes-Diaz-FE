import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { TableModule } from 'primeng/table';

interface TravelSelectionResult {
  selectedIds: number[];
  totalAmount: number;
}

@Component({
  selector: 'app-travel-selecction',
  templateUrl: './travel-selecction.component.html',
  imports: [TableModule, CommonModule],
})
export class TravelSelecctionComponent implements OnChanges, OnInit {
  dialogRef = inject(DialogRef<TravelSelectionResult>);

  travels: any[] = [];
  selectedIds: number[] = [];
  totalAmount = 0;
  onToggle(event: Event, travelId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedIds = checked
      ? [...this.selectedIds, travelId]
      : this.selectedIds.filter((id) => id !== travelId);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.travels
      .filter((t) => this.selectedIds.includes(t.id))
      .reduce((sum, t) => sum + (t.withIVAmount || 0), 0);
  }

  close() {
    this.dialogRef.close();
  }
  confirm() {
    this.dialogRef.close({
      selectedIds: this.selectedIds,
      totalAmount: this.totalAmount,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['travels'] && this.travels?.length) {
      if (!this.selectedIds || this.selectedIds.length === 0) {
        this.selectedIds = this.travels.map((t) => t.id);
      }
      this.calculateTotal();
    }
  }
  ngOnInit(): void {
    this.calculateTotal();
  }
}
