import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ElementRef, HostListener } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports:[MatIcon, CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  @Input() sidebarOpen: boolean = false;
  @Output() sidebarClose: EventEmitter<void> = new EventEmitter();

  closeSidebar() {
    this.sidebarClose.emit();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (this.sidebarOpen && !target.closest('.sidebar')) {
      this.closeSidebar();
    }
  }

  ngOnInit() {}
}
