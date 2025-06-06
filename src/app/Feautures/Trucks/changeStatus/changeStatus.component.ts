import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { from } from 'rxjs';
import { Truck } from '../Trucks';
import { TruckServiceService } from '../TruckService.service';

@Component({
  selector: 'app-changeStatus',
  templateUrl: './changeStatus.component.html',
  imports: [ButtonModule, CommonModule],
})
export class ChangeStatusComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private truckService: TruckServiceService,
    @Inject(DIALOG_DATA) public data: Truck,
    private toast: HotToastService
  ) {}

  confirmChange() {
    from(this.truckService.disableTruck(this.data.plate))
      .pipe(
        this.toast.observe({
          loading: 'Editando estado del camión, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['trucks'] });
            this.cancel();
            return 'Estado del Camión editado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al deshabilitar el camión: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
