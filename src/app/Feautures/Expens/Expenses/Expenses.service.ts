import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments';

interface Expenses {
  mount: number;
  name: string;
  date: string;
  truck_plate: string;
}
interface ExpensesResponse {
  data: ExpensesList[];
  count: number;
  total:number
}

interface truck {
  plate: string;
  name: string;
}
interface ExpensesList {
  mount: number;
  name: string;
  date: string;
  truck: truck;
}

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private http = inject(HttpClient);
  private API_URL = environment.API_URL;

  async getExpenses(page: number, filters: { plate?: string; date?: Date; endDate?: Date }): Promise<ExpensesResponse> {
    try {
      let params = new HttpParams().set('page', page.toString());
      
      if (filters.plate) params = params.set('plate', filters.plate);
      if (filters.date) params = params.set('date', filters.date.toISOString().split('T')[0]); 
      if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString().split('T')[0]);

      const response = await lastValueFrom(
        this.http.get<ExpensesResponse>(`${this.API_URL}/expenses`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      throw error;
    }
  }

  async addExpense(newExpen: Expenses): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(
          `${this.API_URL}/expenses`,
          newExpen
        )
      );
      return response;
    } catch (error) {
      console.error('Error al agregar el camion:', error);
      throw error;
    }
  }

}
