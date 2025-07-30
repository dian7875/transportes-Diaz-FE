import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { ClientsService } from '../../MyClients/clients.service';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InvoicesService } from '../invoices.service';
import { from } from 'rxjs';
import { TableModule } from 'primeng/table';
import { TravelSelecctionComponent } from '../travel-selecction/travel-selecction.component';

interface newInvoice {
  invoicesNumber: string;
  invoiceAmount: number;
  dueDate: Date;
  invoiceDate: Date;
  client_id: number;
}
interface TravelSelectionResult {
  selectedIds: number[];
  totalAmount: number;
}

@Component({
  selector: 'app-newInvoicesForm',
  templateUrl: './newInvoicesForm.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePicker,
    SelectModule,
    InputGroupModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumber,
    InputTextModule,
    TableModule,
  ],
  providers: [DatePipe],
})
export class NewInvoicesFormComponent {
  queryClient = inject(QueryClient);
  InvoiceForm: FormGroup;
  dialog = inject(Dialog);
  client_id = signal('');
  startDate = signal(new Date());
  endDate = signal(new Date());
  travelsData: any[] = [];

  constructor(
    private dialogRef: DialogRef<NewInvoicesFormComponent>,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.InvoiceForm = this.fb.group({
      invoiceAmount: [null, Validators.required],
      client_id: [''],
      invoicesNumber: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      invoiceDate: ['', [Validators.required]],
      id_travel_list: this.fb.control([], Validators.required),
    });
  }

  async onSubmit() {
    if (this.InvoiceForm.invalid) {
      return;
    }
    
    const invoice = this.InvoiceForm.value;
    const dueFormattedDate = this.datePipe.transform(
      invoice.dueDate,
      'yyyy-MM-dd'
    );
    const formattedDate = this.datePipe.transform(
      invoice.invoiceDate,
      'yyyy-MM-dd'
    );
    invoice.dueDate = dueFormattedDate;
    invoice.invoiceDate = formattedDate;

    from(this.invoicesService.addInvoice(invoice))
      .pipe(
        this.toast.observe({
          loading: 'Guardando factura, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['invoices'] });
            this.closeModal();
            return 'Factura guardada con éxito';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al guardar la factura: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }

  clientService = inject(ClientsService);
  invoicesService = inject(InvoicesService);

  clientList = injectQuery(() => ({
    queryKey: ['client-complete'],
    queryFn: () => this.clientService.getClientList(),
  }));

  private isInitialLoad = true;

  total = injectQuery(() => ({
    queryKey: [
      'total-amount',
      this.client_id(),
      this.endDate(),
      this.startDate(),
    ],
    queryFn: () => (
      (this.isInitialLoad = true),
      this.invoicesService.getTravelsAmount(
        Number(this.client_id()),
        this.startDate(),
        this.endDate()
      )
    ),
    enabled: !!this.client_id() && !!this.startDate() && !!this.endDate(),
  }));

  closeModal() {
    this.dialogRef.close();
  }

  openTravelsModal() {
    const dialogRef = this.dialog.open<
      TravelSelecctionComponent,
      TravelSelectionResult
    >(TravelSelecctionComponent, { width: '800px' });

    const instance = dialogRef.componentInstance as TravelSelecctionComponent;

    instance.travels = this.travelsData;
    instance.selectedIds = this.InvoiceForm.value.id_travel_list ?? [];

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.InvoiceForm.patchValue({ id_travel_list: result.selectedIds });
        this.InvoiceForm.patchValue({ invoiceAmount: result.totalAmount });
      }
    });
  }

  ngDoCheck(): void {
    const totalData = this.total.data();

    if (totalData?.travels) {
      this.travelsData = totalData.travels;

      if (
        (!this.InvoiceForm.value.id_travel_list ||
          this.InvoiceForm.value.id_travel_list.length === 0) &&
        this.travelsData.length > 0
      ) {
        const allIds = this.travelsData.map((t) => t.id);
        this.InvoiceForm.patchValue({ id_travel_list: allIds });
      }
    }

    if (!this.isInitialLoad) {
      return;
    } else if (totalData && totalData.total !== undefined) {
      this.InvoiceForm.patchValue({ invoiceAmount: totalData.total });
      this.InvoiceForm.patchValue({ client_id: this.client_id() });
      this.isInitialLoad = false;
    }
  }
}
