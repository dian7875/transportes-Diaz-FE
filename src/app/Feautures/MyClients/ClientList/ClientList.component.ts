import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-ClientList',
  templateUrl: './ClientList.component.html',
  imports: [CommonModule, TableModule, ButtonModule, InputGroupModule],
})
export class ClientListComponent {

  constructor(private dialog: Dialog) {}
 
  displayedColumns: string[] = ['id', 'name'];
  selectedClient: any[] = [];
  metaKey: boolean = false;
  ClientService = inject(ClientsService);
  currentPage = signal(1);

  clients = injectQuery(() => ({
    queryKey: ['clients', this.currentPage()],
    queryFn: () => this.ClientService.getClients(this.currentPage()),
  }));

  loadPage(page: number) {
    this.currentPage.set(page);
  }

}

