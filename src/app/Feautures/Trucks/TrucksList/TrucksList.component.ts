import { Component, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NewExpensesModalComponent } from '../../Expens/NewExpensesModal/NewExpensesModal.component';
import { TruckServiceService } from '../TruckService.service';
import { Truck } from '../Trucks';
import { EditTruckComponent } from '../EditTruck/EditTruck.component';
import { ChangeStatusComponent } from '../changeStatus/changeStatus.component';

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

  openEdit(truck: Truck) {
    this.dialog.open(EditTruckComponent, {
      data: truck,
    });
  }

  openDelete(truck: Truck) {
    this.dialog.open(ChangeStatusComponent, {
      data: truck,
    });
  }

  loadPage(page: number) {
    this.currentPage.set(page);
  }
}
