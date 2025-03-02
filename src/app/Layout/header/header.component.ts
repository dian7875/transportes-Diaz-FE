import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private dialog: Dialog) {}
  openSidebar() {
    this.dialog.open(SidebarComponent);
  }
}
