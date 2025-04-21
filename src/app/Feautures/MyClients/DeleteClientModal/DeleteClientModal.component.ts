import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ClientsService } from '../clients.service';
import { Client } from '../Client';
import { from } from 'rxjs';

@Component({
  selector: 'delete-client-modal',
  standalone: true,
  templateUrl: './DeleteClientModal.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
})
export class DeleteClientModalComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private clientService: ClientsService,
    @Inject(DIALOG_DATA) public data: Client,
    private toast: HotToastService
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
  confirmDelete() {
    from(this.clientService.disableClient(this.data.id))
      .pipe(
        this.toast.observe({
          loading: 'Deshabilitando cliente, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['clients'] });
            this.closeModal();
            return 'Cliente deshabilitado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al deshabilitar el cliente: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }
}
