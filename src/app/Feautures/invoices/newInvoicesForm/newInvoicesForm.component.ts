import { DialogRef } from '@angular/cdk/dialog';
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

interface newInvoice {
  invoicesNumber: string;
  invoiceAmount: number;
  dueDate: Date;
  invoiceDate: Date;
  client_id: number;
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
  ],
  providers: [DatePipe],
})
export class NewInvoicesFormComponent {
  queryClient = inject(QueryClient);
  InvoiceForm: FormGroup;

  client_id = signal('');
  startDate = signal(new Date());
  endDate = signal(new Date());

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

  ngDoCheck(): void {
    const totalData = this.total.data();
    if(!this.isInitialLoad) {
      return;
    }  else if (totalData && totalData.total !== undefined) {
      this.InvoiceForm.patchValue({ invoiceAmount: totalData.total });
      this.InvoiceForm.patchValue({ client_id: this.client_id() });
      this.isInitialLoad = false;
    }
  }
}
