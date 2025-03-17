import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports:[MatIcon, CommonModule, RouterModule, ButtonModule],
  standalone: true,
  
})
export class SidebarComponent {
  constructor(private dialogRef:DialogRef<SidebarComponent>) { }

  isDropdownexpenOpen = true;
  isDropdownReportOpen = true;
  isDropdownGeneralOpen = true;

  toggleDropdownGeneral(){
    this.isDropdownGeneralOpen = !this.isDropdownGeneralOpen;
  }
  toggleDropdownReport(){
    this.isDropdownReportOpen = !this.isDropdownReportOpen;
  }
  toggleDropdownexpen(){
    this.isDropdownexpenOpen = !this.isDropdownexpenOpen;
  }
  
  closeSidebar(){
    this.dialogRef.close();
  }
  
}
