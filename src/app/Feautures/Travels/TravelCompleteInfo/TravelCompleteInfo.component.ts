import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Travel } from '../Travel';

@Component({
  selector: 'app-TravelCompleteInfo',
  templateUrl: './TravelCompleteInfo.component.html',
})
export class TravelCompleteInfoComponent {
  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public travel: Travel
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}
