import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TruckServiceService } from '../TruckService.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Truck } from '../Trucks';
import { from } from 'rxjs';

@Component({
  selector: 'app-DisableTruck',
  templateUrl: './DisableTruck.component.html',
  imports: [ButtonModule, CommonModule],
})
export class DisableTruckComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private truckService: TruckServiceService,
    @Inject(DIALOG_DATA) public data: Truck,
    private toast: HotToastService
  ) {}

  confirmDelete() {
    from(this.truckService.disableTruck(this.data.plate))
      .pipe(
        this.toast.observe({
          loading: 'Deshabilitando camión, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['trucks'] });
            this.cancel();
            return 'Camión deshabilitado correctamente';
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
