import { EditDriverComponent } from './../EditDriver/EditDriver.component';
import { Component, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DriversService } from '../driver.service';
import { Driver } from '../Drivers';
import { DeleteDriverComponent } from '../DeleteDriver/DeleteDriver.component';

@Component({
  selector: 'DriverList',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputGroupModule],
  templateUrl: './DriverList.component.html',
})
export class DriverListComponent {
  constructor(private dialog: Dialog) {}

  displayedColumns: string[] = [
    'id',
    'name',
    'startDate',
    'status',
    'Acciones',
  ];
  selectedDriver: any[] = [];
  metaKey: boolean = false;
  driverService = inject(DriversService);
  currentPage = signal(1);

  drivers = injectQuery(() => ({
    queryKey: ['drivers', this.currentPage()],
    queryFn: () => this.driverService.getDrivers(this.currentPage()),
  }));

  loadPage(page: number) {
    this.currentPage.set(page);
  }

  openEdit(driver: Driver) {
    this.dialog.open(EditDriverComponent, {
      data: driver,
    });
  }
  openDelete(driver: Driver) {
    this.dialog.open(DeleteDriverComponent, {
      data: driver,
    });
  }
}
