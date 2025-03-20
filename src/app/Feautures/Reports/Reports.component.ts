import { Component } from '@angular/core';
import { TravelsResumenComponent } from './TravelsResumen/TravelsResumen.component';

@Component({
  selector: 'app-Reports',
  templateUrl: './Reports.component.html',
  imports: [TravelsResumenComponent],
})
export class ReportsComponent {
  constructor() {}

  ngOnInit() {}
}
