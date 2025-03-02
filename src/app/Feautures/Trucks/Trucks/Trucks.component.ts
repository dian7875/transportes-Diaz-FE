import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { TrucksList } from '../TrucksList/TrucksList.component';
import { NewTruckModalComponent } from '../NewTruckModal/NewTruckModal.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-Trucks',
  templateUrl: './Trucks.component.html',
  imports: [CommonModule,ButtonModule, TrucksList],
})
export class TrucksComponent implements OnInit {
  constructor(private dialog: Dialog) {}

    openModal(){
      this.dialog.open(NewTruckModalComponent);
    }

  ngOnInit() {}
}
