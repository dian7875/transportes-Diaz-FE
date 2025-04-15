import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrucksComponent } from './Feautures/Trucks/Trucks/Trucks.component';
import { DriversComponent } from './Feautures/Drivers/Drivers/Drivers.component';
import { TravelsComponent } from './Feautures/Travels/Travels/Travels.component';
import { MyClientsComponent } from './Feautures/MyClients/MyClients/MyClients.component';
import { ExpensesComponent } from './Feautures/Expens/Expenses/Expenses.component';
import { ReportsComponent } from './Feautures/Reports/Reports.component';
import { InvoicesComponent } from './Feautures/invoices/invoices.component';

import { HomeComponent } from './Pages/Home/Home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clientes', component: MyClientsComponent },
  { path: 'transportes', component: TravelsComponent },
  { path: 'choferes', component: DriversComponent },
  { path: 'camiones', component: TrucksComponent },
  { path: 'reportes', component: ReportsComponent },
  { path: 'gastos', component: ExpensesComponent },
  { path: 'facturas', component: InvoicesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
