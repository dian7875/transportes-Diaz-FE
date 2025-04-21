import { HotToastService, Toast } from '@ngxpert/hot-toast';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Driver } from '../Drivers';
import { from } from 'rxjs';
import { DriversService } from '../driver.service';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-DeleteDriver',
  templateUrl: './DeleteDriver.component.html',
  imports: [ButtonModule, CommonModule],
})
export class DeleteDriverComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private driverService: DriversService,
    @Inject(DIALOG_DATA) public data: Driver,
    private toast: HotToastService
  ) {}

  confirmDelete() {
    from(this.driverService.disableDriver(this.data.id))
      .pipe(
        this.toast.observe({
          loading: 'Deshabilitando conductor, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['drivers'] });
            this.cancel();
            return 'Conductor deshbailitado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al deshabilitar el conductor: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
