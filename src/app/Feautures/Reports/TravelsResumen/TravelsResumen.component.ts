import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TruckServiceService } from '../../Trucks/TrucksList/TruckService.service';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { TravelService } from '../../Travels/Travel.service';
import { ClientsService } from '../../MyClients/clients.service';
import { ReportsService } from '../Reports.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface filterReport {
  startDate: string;
  endDate: string;
  truck_plate: string;
  client_id: string;
  reportType: string;
}

@Component({
  selector: 'app-TravelsResumen',
  templateUrl: './TravelsResumen.component.html',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputGroupModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    DatePicker,
    ProgressSpinnerModule
  ],
  providers: [DatePipe],
})
export class TravelsResumenComponent {
  constructor(private toast: HotToastService, private datePipe: DatePipe) {}

  truck_plate = signal('');
  client_id = signal('');
  startDate = signal<Date | null>(null);
  endDate = signal(new Date());
  reportType = signal('');

  mutation = injectMutation(() => ({
    mutationFn: (filterR: filterReport) =>
      this.reportService.downloadLoanReport(filterR),
  }));

  get isLoading() {
    return this.mutation.isPending();
  }

  async downloadReport() {
    this.mutation.mutate(
      {
        truck_plate: this.truck_plate() || '',
        startDate:
          this.datePipe.transform(this.startDate(), 'yyyy-MM-dd') || '',
        endDate: this.datePipe.transform(this.endDate(), 'yyyy-MM-dd') || '',
        client_id: this.client_id() || '',
        reportType: this.reportType() || '',
      },
      { 
        onSuccess: () => {
          this.toast.success('Reporte descargado con éxito');
        },
        onError: (error) => {
          this.toast.error('Error al generar el reporte');
          console.error(error);
        },
      }
    );
  }

  truckService = inject(TruckServiceService);
  clientService = inject(ClientsService);
  reportService = inject(ReportsService);

  displayedColumns: string[] = [
    'travelCode',
    'destination',
    'noIVAmountt',
    'withIVAmount',
    'IVAmount',
    'travelDate',
  ];
  selectedClient: any[] = [];
  metaKey: boolean = false;
  travelService = inject(TravelService);
  currentPage = signal(1);

  travels = injectQuery(() => ({
    queryKey: [
      'travels-report',
      this.truck_plate(),
      this.client_id(),
      this.endDate(),
      this.startDate(),
      this.currentPage(),
    ],
    queryFn: () =>
      this.travelService.getFilterTravels(this.currentPage(), {
        client_id: Number(this.client_id()),
        truck_plate: this.truck_plate(),
        startDate: this.startDate() ?? undefined,
        endDate: this.endDate() ?? undefined,
      }),
  }));

  truckList = injectQuery(() => ({
    queryKey: ['truck-complete'],
    queryFn: () => this.truckService.getTrucksList(),
  }));

  clientList = injectQuery(() => ({
    queryKey: ['client-complete'],
    queryFn: () => this.clientService.getClientList(),
  }));

  loadExpenses() {
    const filters = {
      plate: this.truck_plate(),
      client: this.client_id(),
      startDate: this.startDate(),
      endDate: this.endDate(),
    };
  }

  loadPage(page: number) {
    this.currentPage.set(page);
  }
}
