import { Component, inject } from '@angular/core';
import { TruckServiceService } from './TruckService.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'; 
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'Trucks-List',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputGroupModule],
  templateUrl: './TrucksList.component.html',
})
export class TrucksList {
  displayedColumns: string[] = ['plate', 'name', 'Acciones'];
  selectedTrucks: any[] = [];
  metaKey: boolean = false;
  truckService = inject(TruckServiceService);
  trucks = injectQuery(() => ({
    queryKey: ['trucks'],
    queryFn: () => this.truckService.getTrucks(),
  }));
}
