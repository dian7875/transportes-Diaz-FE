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
import { DriversService } from '../DriverList/driver.service';
import { DatePicker } from 'primeng/datepicker';
import { from } from 'rxjs';

interface Driver {
  id: number;
  name: string;
  startDate: Date;
  endDate?: Date;
  status: boolean;
}

@Component({
  selector: 'app-NewDriverModal',
  templateUrl: './NewDriverModal.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DatePicker],
  providers: [DatePipe],
})
export class NewDriverModalComponent {
  queryClient = inject(QueryClient);
  driverForm: FormGroup;

  constructor(
    private dialogRef: DialogRef<NewDriverModalComponent>,
    private driverService: DriversService,
    private fb: FormBuilder,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
    this.driverForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.driverForm.invalid) {
      return;
    }

    const driver = this.driverForm.value;
    const formattedDate = this.datePipe.transform(
      driver.startDate,
      'yyyy-MM-dd'
    );
    driver.startDate = formattedDate;

    from(this.driverService.addDriver(driver))
      .pipe(
        this.toast.observe({
          loading: 'Añadiendo conductor, por favor espere...',
          success: () => {
            this.queryClient.invalidateQueries({ queryKey: ['drivers'] });
            this.closeModal();
            return 'Conductor agregado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al agregar el conductor: ${errorMessage}`;
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
