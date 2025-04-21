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
import { LoginComponent } from './Core/Auth/Login/Login.component';
import { AuthGuardService } from './Core/Guards/AuthGuard.service';

export const routes: Routes = [
  { path: 'dashboard', component: HomeComponent ,canActivate: [AuthGuardService]},
  { path: 'clientes', component: MyClientsComponent ,canActivate: [AuthGuardService]},
  { path: 'transportes', component: TravelsComponent ,canActivate: [AuthGuardService]},
  { path: 'choferes', component: DriversComponent ,canActivate: [AuthGuardService]},
  { path: 'camiones', component: TrucksComponent ,canActivate: [AuthGuardService]},
  { path: 'reportes', component: ReportsComponent ,canActivate: [AuthGuardService]},
  { path: 'gastos', component: ExpensesComponent ,canActivate: [AuthGuardService]},
  { path: 'facturas', component: InvoicesComponent ,canActivate: [AuthGuardService]},
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
