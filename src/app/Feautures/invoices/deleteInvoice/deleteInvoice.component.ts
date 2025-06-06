import { Component, inject, Inject, OnInit } from '@angular/core';
import { InvoicesService } from '../invoices.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { from } from 'rxjs';

@Component({
  selector: 'app-deleteInvoice',
  templateUrl: './deleteInvoice.component.html',
  imports: [CommonModule, ButtonModule],
})
export class DeleteInvoiceComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private invoiceService: InvoicesService,
    @Inject(DIALOG_DATA) public id: number,
    private toast: HotToastService
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
  confirmDelete() {
    from(this.invoiceService.DeleteInvoice(this.id))
      .pipe(
        this.toast.observe({
          loading: 'Eliminando factura, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['invoices'] });
            this.closeModal();
            return 'Factura eliminada correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al eliminar el gasto: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }
}
