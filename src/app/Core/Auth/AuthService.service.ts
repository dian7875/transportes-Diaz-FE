import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axiosInstance from '../../Core/Config/axios.config';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private router: Router) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await axiosInstance.get('/auth/status');
      const result = response.data.isAuthenticated;
      this.isAuthenticatedSubject.next(result);
      return result;
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
      return false;
    }
  }
  async logout() {
    try {
      await axiosInstance.post('/auth/logout');
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(error.response?.data.message);
      } else {
        console.error('Error al cerrar sesión', error);
      }
    }
  }

  async LogIn(credentials: {
    userName: string;
    password: string;
  }): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        '/auth/login',
        credentials
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Error al iniciar sesión';
        throw new Error(message);
      } else {
        console.error('Error desconocido al iniciar sesión:', error);
        throw error;
      }
    }
  }
}
