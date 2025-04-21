import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { TruckServiceService } from '../TruckService.service';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Truck } from '../Trucks';
import { from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-EditTruck',
  templateUrl: './EditTruck.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
})
export class EditTruckComponent {
  queryClient = inject(QueryClient);
  truckForm: FormGroup;
  constructor(
    @Inject(DIALOG_DATA) public data: Truck,
    private dialogRef: DialogRef<EditTruckComponent>,
    private truckService: TruckServiceService,
    private fb: FormBuilder,
    private toast: HotToastService
  ) {
    this.truckForm = this.fb.group({
      plate: [data.plate],
      name: [data.name, Validators.required],
    });
  }
  async onSubmit() {
    if (this.truckForm.invalid) {
      return;
    }
    const truck = this.truckForm.value;

    from(this.truckService.editTruck(truck))
      .pipe(
        this.toast.observe({
          loading: 'Actualizando camión...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['trucks'] });
            this.closeModal();
            return 'Camión actualizado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Unknown error';
            return `Error al actualizar camión: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {});
  }
  closeModal() {
    this.dialogRef.close();
  }
}
