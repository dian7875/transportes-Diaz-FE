import { Component, OnInit } from '@angular/core';
import { ClientListComponent } from '../ClientList/ClientList.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dialog } from '@angular/cdk/dialog';
import { NewClientComponent } from '../NewClient/NewClient.component';

@Component({
  selector: 'app-MyClients',
  templateUrl: './MyClients.component.html',
  imports: [ClientListComponent, CommonModule, ButtonModule],
})
export class MyClientsComponent implements OnInit {
  constructor(private dialog: Dialog) {}

  openModal() {
    this.dialog.open(NewClientComponent);
  }

  ngOnInit() {}
}
