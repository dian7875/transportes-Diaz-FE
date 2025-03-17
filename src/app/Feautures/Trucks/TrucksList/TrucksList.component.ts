import { Component, inject, signal } from '@angular/core';
import { TruckServiceService } from './TruckService.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NewExpensesModalComponent } from '../../Expens/NewExpensesModal/NewExpensesModal.component';

@Component({
  selector: 'Trucks-List',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputGroupModule],
  templateUrl: './TrucksList.component.html',
})
export class TrucksList {
  constructor(private dialog: Dialog) {}

  openNewExpen(plate: string) {
    this.dialog.open(NewExpensesModalComponent, { data: { plate } });
  }

  displayedColumns: string[] = ['plate', 'name', 'Acciones'];
  selectedTrucks: any[] = [];
  metaKey: boolean = false;
  truckService = inject(TruckServiceService);
  currentPage = signal(1);

  trucks = injectQuery(() => ({
    queryKey: ['trucks', this.currentPage()],
    queryFn: () => this.truckService.getTrucks(this.currentPage()),
  }));


  
  loadPage(page: number) {
    this.currentPage.set(page); 
  }
}
