import { id } from '@swimlane/ngx-charts';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { from } from 'rxjs';
import { TravelService } from '../Travel.service';

@Component({
  selector: 'app-DeleteTravel',
  templateUrl: './DeleteTravel.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
})
export class DeleteTravelComponent {
  queryClient = inject(QueryClient);
  constructor(
    public dialogRef: DialogRef<boolean>,
    private travelService: TravelService,
    @Inject(DIALOG_DATA) public id:number ,
    private toast: HotToastService
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
  confirmDelete() {
    from(this.travelService.DeleteTravel(this.id))
      .pipe(
        this.toast.observe({
          loading: 'Eliminando Transporte, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['travels'] });
            this.closeModal();
            return 'Transporte eliminado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al eliminar el Transporte: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }
}
