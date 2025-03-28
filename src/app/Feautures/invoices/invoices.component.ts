import { Component, OnInit } from '@angular/core';
import { NewInvoicesFormComponent } from './newInvoicesForm/newInvoicesForm.component';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonModule } from 'primeng/button';
import { InvoicesListComponent } from "./invoicesList/invoicesList.component";

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  imports: [ButtonModule, InvoicesListComponent],
})
export class InvoicesComponent {
  constructor(private dialog: Dialog) {}

  openModal() {
    this.dialog.open(NewInvoicesFormComponent);
  }
}
