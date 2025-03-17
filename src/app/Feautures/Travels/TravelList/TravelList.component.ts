import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { TravelService } from '../Travel.service';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-TravelList',
  templateUrl: './TravelList.component.html',
  imports: [CommonModule, TableModule, ButtonModule, InputGroupModule],
  providers:[DatePipe]
})
export class TravelListComponent {
  constructor(private dialog: Dialog) {}

  displayedColumns: string[] = ['travelCode', 'destination','noIVAmountt','withIVAmount','IVAmount','travelDate'];
  selectedClient: any[] = [];
  metaKey: boolean = false;
  travelService = inject(TravelService);
  currentPage = signal(1);

  travels = injectQuery(() => ({
    queryKey: ['travels', this.currentPage()],
    queryFn: () => this.travelService.getTravels(this.currentPage()),
  }));

  loadPage(page: number) {
    this.currentPage.set(page);
  }
}
