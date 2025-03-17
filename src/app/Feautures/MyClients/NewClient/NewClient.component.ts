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
  mutation = injectMutation(() => ({
    mutationFn: (client: client) => this.clientService.addClient(client),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  }));

  async onSubmit() {
    if (this.clientForm.invalid) {
      return;
    }
    const client = this.clientForm.value;

    try {
      this.mutation.mutate(client);
      this.toast.success('Cliente agregado correctamente');
      this.closeModal();
    } catch (error) {
      console.error('Error al agregar el cliente', error);
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
  ngOnInit() {}
}

