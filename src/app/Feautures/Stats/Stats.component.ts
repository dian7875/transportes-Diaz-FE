import { CounterCardComponent } from './CounterCard/CounterCard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component, effect, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { StatsService } from './Stats.service';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-Stats',
  templateUrl: './Stats.component.html',
  imports: [NgxChartsModule, CounterCardComponent, FormsModule, DatePicker, ],
})
export class StatsComponent {
  constructor(private statService: StatsService) {}

  date = signal(new Date());

  stats = injectQuery(() => ({
    queryKey: ['stats', this.date()],
    queryFn: () => this.statService.getStats(this.date()),
  }));
  Truckstats = injectQuery(() => ({
    queryKey: ['Truckstats', this.date()],
    queryFn: () => this.statService.getTruckStats(this.date()),
  }));

  generalCount = injectQuery(() => ({
    queryKey: ['GeneralCount', this.date()],
    queryFn: () => this.statService.getGeneralCounts(this.date()),
  }));

  data = [
    {
      name: 'Gastos',
      value: 0,
    },
    {
      name: 'Producido',
      value: 0,
    },
  ];

  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  showLegend: boolean = true;
  xAxisLabel: string = 'Camion';
  showYAxisLabel: boolean = true;

  secondData: any[] = [];

  effect = effect(() => {
    const truckStats = this.Truckstats.data();
    if (truckStats) {
      this.secondData = truckStats;
    }
    const statsData = this.stats.data();
    if (statsData) {
      this.data = [
        { name: 'Gastos', value: statsData.expenses },
        { name: 'Producido', value: statsData.produced },
      ];
    }
  });
}
