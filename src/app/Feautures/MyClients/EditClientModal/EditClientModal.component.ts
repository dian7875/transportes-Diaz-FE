import { ClientsService } from './../clients.service';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Client } from '../Client';
import { HotToastService } from '@ngxpert/hot-toast';
import { id } from '@swimlane/ngx-charts';
import { from } from 'rxjs';

@Component({
  selector: 'edit-client-modal',
  standalone: true,
  templateUrl: './EditClientModal.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
})
export class EditClientModalComponent {
  queryClient = inject(QueryClient);
  clientForm: FormGroup;
  constructor(
    @Inject(DIALOG_DATA) public data: Client,
    private dialogRef: DialogRef<EditClientModalComponent>,
    private clientService: ClientsService,
    private fb: FormBuilder,
    private toast: HotToastService
  ) {
    this.clientForm = this.fb.group({
      id:[data.id],
      name: [data.name, Validators.required],
    });
  }

  async onSubmit() {
    if (this.clientForm.invalid) {
      return;
    }
    const client = this.clientForm.value;

    from(this.clientService.editClient(client))
      .pipe(
        this.toast.observe({
          loading: 'Actualizando cliente, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['clients'] });
            this.closeModal();
            return 'Cliente actualizado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al actualizar el cliente: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
