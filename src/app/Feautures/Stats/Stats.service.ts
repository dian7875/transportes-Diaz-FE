import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);

  private API_URL = environment.API_URL;

  async getStats(date?: Date): Promise<{ expenses: number; produced: number }> {
    try {
      const params = new HttpParams().set('week', date?.toString() || '');
      const response = await lastValueFrom(
        this.http.get<{ expenses: number; produced: number }>(
          `${this.API_URL}/stats`,
          { params }
        )
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los transportes:', error);
      throw error;
    }
  }
  async getTruckStats(
    date?: Date
  ): Promise<{ name: string; series: { name: string; value: number }[] }[]> {
    try {
      const params = new HttpParams().set('week', date?.toString() || '');
      const response = await lastValueFrom(
        this.http.get<
          { name: string; series: { name: string; value: number }[] }[]
        >(`${this.API_URL}/stats/TruckStats`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los transportes:', error);
      throw error;
    }
  }
  async getGeneralCounts(date?: Date): Promise<{
    clients: number;
    drivers: number;
    trucks: number;
    TravelsCount: number;
    productivity: number;
  }> {
    try {
      const params = new HttpParams().set('week', date?.toString() || '');
      const response = await lastValueFrom(
        this.http.get<{
          clients: number;
          drivers: number;
          trucks: number;
          TravelsCount: number;
          productivity: number;
        }>(`${this.API_URL}/stats/counts`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los transportes:', error);
      throw error;
    }
  }
}
