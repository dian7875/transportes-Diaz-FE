import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { NewTravelModalComponent } from '../NewTravelModal/NewTravelModal.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TravelListComponent } from "../TravelList/TravelList.component";

@Component({
  selector: 'app-Travels',
  templateUrl: './Travels.component.html',
  imports: [CommonModule, ButtonModule, TravelListComponent],
})
export class TravelsComponent implements OnInit {
  constructor(private dialog: Dialog) {}

  openModal() {
    this.dialog.open(NewTravelModalComponent);
  }

  ngOnInit() {}
}
