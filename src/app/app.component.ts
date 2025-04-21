import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Layout/header/header.component';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { AuthServiceService } from './Core/Auth/AuthService.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  showHeader = false;
  private routerSubscription?: Subscription;
  private authSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuth) => {
        this.showHeader = isAuth;
        this.cdr.detectChanges();
      }
    );

    this.authService.isAuthenticated();

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen = false;
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
