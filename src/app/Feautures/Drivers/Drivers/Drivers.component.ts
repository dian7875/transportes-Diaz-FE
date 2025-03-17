import { Component, OnInit } from '@angular/core';
import { DriverListComponent } from '../DriverList/DriverList.component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonModule } from 'primeng/button';
import { NewDriverModalComponent } from '../NewDriverModal/NewDriverModal.component';

@Component({
  selector: 'app-Drivers',
  templateUrl: './Drivers.component.html',
  imports: [DriverListComponent, CommonModule, ButtonModule],
})
export class DriversComponent implements OnInit {
  constructor(private dialog: Dialog) {}

  openModal() {
    this.dialog.open(NewDriverModalComponent);
  }

  ngOnInit() {}
}
