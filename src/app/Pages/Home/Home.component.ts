import { Component, OnInit } from '@angular/core';
import { StatsComponent } from "../../Feautures/Stats/Stats.component";

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  imports: [StatsComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
