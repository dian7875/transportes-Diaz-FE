import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-CounterCard',
  templateUrl: './CounterCard.component.html',
})
export class CounterCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() count: number = 0;

  constructor() {}

  ngOnInit() {}
}
