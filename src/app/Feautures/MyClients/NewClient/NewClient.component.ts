import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  QueryClient,
  injectMutation,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { ClientsService } from '../clients.service';
import { from } from 'rxjs';

interface client {
  name: string;
}
@Component({
  selector: 'app-NewClient',
  templateUrl: './NewClient.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  providers: [DatePipe],
})
export class NewClientComponent implements OnInit {
  queryClient = inject(QueryClient);
  clientForm: FormGroup;

  constructor(
    private dialogRef: DialogRef<NewClientComponent>,
    private clientService: ClientsService,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.clientForm.invalid) {
      return;
    }
    const client = this.clientForm.value;

    from(this.clientService.addClient(client))
      .pipe(
        this.toast.observe({
          loading: 'Añadiendo cliente, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['clients'] });
            this.closeModal();
            return 'Cliente agregado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al agregar el cliente: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {});
  }

  closeModal() {
    this.dialogRef.close();
  }
  ngOnInit() {}
}
