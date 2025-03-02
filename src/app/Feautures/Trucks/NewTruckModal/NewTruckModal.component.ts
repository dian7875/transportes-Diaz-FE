import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TruckServiceService } from '../TrucksList/TruckService.service';
import { CommonModule } from '@angular/common';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { HotToastService } from '@ngxpert/hot-toast';
import { ButtonModule } from 'primeng/button';

interface Truck {
  plate: string;
  name: string;
}

@Component({
  selector: 'app-NewTruckModal',
  templateUrl: './NewTruckModal.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
})
export class NewTruckModalComponent {
  private toastService = inject(HotToastService);
  queryClient = inject(QueryClient)
  truckForm: FormGroup;

  constructor(
    private dialogRef: DialogRef<NewTruckModalComponent>,
    private truckService: TruckServiceService,
    private fb: FormBuilder,
    private toast: HotToastService
  ) {
    this.truckForm = this.fb.group({
      name: ['', [Validators.required]],
      plate: ['', [Validators.required]],
    });
  }

  mutation = injectMutation(() => ({
    mutationFn: (truck:Truck) => this.truckService.addTruck(truck),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['trucks'] })
    },
  }))

  async onSubmit() {
    if (this.truckForm.invalid) {
      return;
    }
    const truck = this.truckForm.value;
    try {
      this.mutation.mutate(truck);
      this.toast.success('Camión agregado correctamente');
      this.closeModal();
    } catch (error) {
      console.error('Error al agregar camión', error);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
