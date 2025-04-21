import { Component, inject, Inject, OnInit } from '@angular/core';
import { Driver } from '../Drivers';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DriversService } from '../driver.service';
import { CommonModule, DatePipe } from '@angular/common';
import { from } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-EditDriver',
  templateUrl: './EditDriver.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DatePicker],
  providers: [DatePipe],
})
export class EditDriverComponent {
  driverForm: FormGroup;
  queryClient = inject(QueryClient);

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: Driver,
    private driverService: DriversService,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.driverForm = this.fb.group({
      id: [data.id, [Validators.required]],
      name: [data.name, [Validators.required]],
      startDate: [
        new Date(data.startDate + 'T00:00:00'),
        [Validators.required],
      ],
      endDate: [data.endDate ? new Date(data.endDate + 'T00:00:00') : null],
    });
  }

  onSubmit() {
    if (this.driverForm.invalid) {
      return;
    }

    const driver = this.driverForm.value;
    const formattedDate = this.datePipe.transform(
      driver.startDate,
      'yyyy-MM-dd'
    );

    driver.startDate = formattedDate;

    from(this.driverService.patchDriver(driver))
      .pipe(
        this.toast.observe({
          loading: 'Actualizando conductor, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['drivers'] });
            this.closeModal();
            return 'Conductor actualizado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al actualizar el conductor: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {});
  }

  closeModal() {
    this.dialogRef.close(false);
  }
}
