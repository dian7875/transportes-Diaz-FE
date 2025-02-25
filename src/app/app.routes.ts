import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrucksComponent } from './Feautures/Trucks/Trucks/Trucks.component';
import { DriversComponent } from './Feautures/Drivers/Drivers/Drivers.component';
import { TravelsComponent } from './Feautures/Travels/Travels/Travels.component';
import { MyClientsComponent } from './Feautures/MyClients/MyClients/MyClients.component';

export const routes: Routes = [
  {path:'clientes', component:MyClientsComponent},
  {path:'transportes', component:TravelsComponent},
  { path: 'choferes', component: DriversComponent },
  { path: 'camiones', component: TrucksComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
