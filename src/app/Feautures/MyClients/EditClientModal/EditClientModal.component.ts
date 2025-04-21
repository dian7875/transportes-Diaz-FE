import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'edit-client-modal',
  standalone: true,
  templateUrl: './EditClientModal.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ]
})
export class EditClientModalComponent implements OnInit {
  private dialogRef = inject(DialogRef);
  private data = inject(DIALOG_DATA);
  private fb = inject(FormBuilder);

  clientForm: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit() {
    if (this.data?.client) {
      this.clientForm.patchValue({
        name: this.data.client.name
      });
    }
  }

  onSubmit() {
    // no hace nada
  }

  closeModal() {
    this.dialogRef.close();
  }
}
