import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom } from 'rxjs';

interface Expenses {
  mount: number;
  name: string;
  date: string;
  truck_plate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private http = inject(HttpClient);
  private API_URL = environment.API_URL;

  async addExpense(newExpen: Expenses): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.API_URL}/expenses`, newExpen)
      );
      return response
    } catch (error) {
      console.error('Error al agregar el camion:', error);
      throw error;
    }
  }
}
