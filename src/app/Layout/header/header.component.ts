import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone:true,
  imports: [],
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  @Output() closeSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  closeSidebar() {
    this.closeSidebarEvent.emit();
  }
}
