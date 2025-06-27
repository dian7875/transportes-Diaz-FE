import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NewInvoicesFormComponent } from '../newInvoicesForm/newInvoicesForm.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SplitButton } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { ClientsService } from '../../MyClients/clients.service';
import { InvoicesService } from '../invoices.service';
import { ReportsService } from '../../Reports/Reports.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { DeleteInvoiceComponent } from '../deleteInvoice/deleteInvoice.component';

interface filterReport {
  startDate: string;
  endDate: string;
  client_id: string;
  reportType: string;
}

@Component({
  selector: 'app-invoicesList',
  templateUrl: './invoicesList.component.html',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputGroupModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    DatePicker,
    ProgressSpinnerModule,
    SplitButton,
  ],
  providers: [DatePipe],
})
export class InvoicesListComponent {
  clientService = inject(ClientsService);
  reportService = inject(ReportsService);

  client_id = signal('');
  startDate = signal<Date | null>(null);
  endDate = signal(new Date());

  metaKey: boolean = false;
  invoiceService = inject(InvoicesService);
  currentPage = signal(1);

  constructor(
    private dialog: Dialog,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {}

  openModal() {
    this.dialog.open(NewInvoicesFormComponent);
  }

  openDelete(id: number) {
    this.dialog.open(DeleteInvoiceComponent, {
      data: id,
    });
  }

  clientList = injectQuery(() => ({
    queryKey: ['client-complete'],
    queryFn: () => this.clientService.getClientList(),
  }));

  splitButtonItems = [
    {
      label: 'Generar Reporte',
      command: () => {
        this.downloadReport();
      },
    },
    {
      label: 'Generar Excel',
      command: () => {
        this.generateExcel();
      },
    },
  ];

  invoicesList = injectQuery(() => ({
    queryKey: [
      'invoices',
      this.client_id(),
      this.endDate(),
      this.startDate(),
      this.currentPage(),
    ],
    queryFn: () =>
      this.invoiceService.getInvoices(
        this.currentPage(),
        Number(this.client_id()) ?? undefined,
        this.startDate() ?? undefined,
        this.endDate() ?? undefined
      ),
  }));

  mutation = injectMutation(() => ({
    mutationFn: (filterR: filterReport) =>
      this.reportService.downloadReport(filterR),
  }));
  mutationExcel = injectMutation(() => ({
    mutationFn: (client_Id: number) =>
      this.reportService.downloadExcel(client_Id),
  }));

  get isLoading() {
    return this.mutation.isPending();
  }

  async downloadReport() {
    this.mutation.mutate(
      {
        startDate:
          this.datePipe.transform(this.startDate(), 'yyyy-MM-dd') || '',
        endDate: this.datePipe.transform(this.endDate(), 'yyyy-MM-dd') || '',
        client_id: this.client_id() || '',
        reportType: 'IV',
      },
      {
        onSuccess: () => {
          this.toast.success('Reporte descargado con éxito');
        },
        onError: (error) => {
          this.toast.error(error.message);
          console.error(error);
        },
      }
    );
  }

  async generateExcel() {
    this.mutationExcel.mutate(
      Number(this.client_id()),
      {
        onSuccess: () => {
          this.toast.success('Reporte descargado con éxito');
        },
        onError: (error) => {
          this.toast.error(error.message);
          console.error(error.message);
        },
      }
    );
  }

  loadPage(page: number) {
    this.currentPage.set(page);
  }
}
