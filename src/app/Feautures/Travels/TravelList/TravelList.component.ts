import { Dialog } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { TravelService } from '../Travel.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DeleteTravelComponent } from '../DeleteTravel/DeleteTravel.component';
import { Travel } from '../Travel';
import { TravelCompleteInfoComponent } from '../TravelCompleteInfo/TravelCompleteInfo.component';
import { AddTravelExpensComponent } from '../add-TravelExpens/add-TravelExpens.component';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-TravelList',
  templateUrl: './TravelList.component.html',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputGroupModule,
    DatePickerModule,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [DatePipe],
})
export class TravelListComponent {
  truckList: any;
  truck_plate: any;
  clientList: any;
  client_id: any;
  startDate: any;
  endDate: any;
  constructor(private dialog: Dialog, private datePipe: DatePipe) {}

  displayedColumns: string[] = [
    'travelCode',
    'destination',
    'noIVAmountt',
    'withIVAmount',
    'IVAmount',
    'travelDate',
  ];
  selectedClient: any[] = [];
  metaKey: boolean = false;
  travelService = inject(TravelService);
  currentPage = signal(1);
  travelCode = signal('');
  destination = signal('');
  date = signal<Date | null>(null);

  travels = injectQuery(() => {
    const dateRaw = this.date();

    const formattedDate = dateRaw
      ? this.datePipe.transform(dateRaw, 'yyyy-MM-dd')
      : undefined;

    return {
      queryKey: [
        'travels',
        this.currentPage(),
        this.destination(),
        this.travelCode(),
        this.date(),
      ],
      queryFn: () =>
        this.travelService.getTravels(
          this.currentPage(),
          this.destination() ?? undefined,
          formattedDate?.toString() ?? undefined,
          this.travelCode() ?? undefined
        ),
    };
  });

  loadPage(page: number) {
    this.currentPage.set(page);
  }

  openDeleteTravelModal(id: number) {
    this.dialog.open(DeleteTravelComponent, {
      data: id,
    });
  }
  openInfoTravelModal(travel: Travel) {
    this.dialog.open(TravelCompleteInfoComponent, {
      data: travel,
    });
  }

  openAddExpense(truck_plate: string, travel_id: number) {
    this.dialog.open(AddTravelExpensComponent, {
      data: { truck_plate, travel_id },
    });
  }
}
