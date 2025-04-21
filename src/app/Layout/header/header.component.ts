import { Dialog } from '@angular/cdk/dialog';
import { Component, ViewChild } from '@angular/core';
import { DrawerModule, Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../Core/Auth/AuthService.service';
import { from } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [DrawerModule, ButtonModule, RouterModule],
})
export class HeaderComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;
  constructor(
    private dialog: Dialog,
    private authService: AuthServiceService,
    private toast: HotToastService
  ) {}

  async logout() {
    from(this.authService.logout())
      .pipe(
        this.toast.observe({
          loading: 'Cerrando sesión, por favor espere...',
          success: () => {
            return 'Sesión cerrada correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al cerrar sesión: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }
}
