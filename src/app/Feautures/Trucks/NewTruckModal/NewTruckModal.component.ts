import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TruckServiceService } from '../TrucksList/TruckService.service';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { HotToastService } from '@ngxpert/hot-toast';
import { ButtonModule } from 'primeng/button';
import { catchError, from } from 'rxjs';

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
  queryClient = inject(QueryClient);
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

  async onSubmit() {
    if (this.truckForm.invalid) {
      return;
    }
    const truck = this.truckForm.value;

    from(this.truckService.addTruck(truck))
      .pipe(
        this.toast.observe({
          loading: 'Añadiendo...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['trucks'] });
            this.closeModal();
            return 'Camion añadido correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Unknown error';
            return `Error al añadir camion: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {
      
      });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
