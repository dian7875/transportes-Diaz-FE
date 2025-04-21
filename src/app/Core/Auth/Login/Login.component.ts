import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { AuthServiceService } from '../AuthService.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  imports:[CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private AuthService: AuthServiceService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const credential = this.loginForm.value;

    from(this.AuthService.LogIn(credential))
      .pipe(
        this.toast.observe({
          loading: 'Iniciando sesión, por favor espere...',
          success: () => {
            this.router.navigate(['/dashboard']);
            return 'Sesión iniciada correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al iniciar sesión: ${errorMessage}`;
          },
        })
      )
      .subscribe();
  }
}
