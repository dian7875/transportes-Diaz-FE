import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Truck {
  plate: string;
  name: string;
}

interface TruckResponse {
  data: Truck[];
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class TruckServiceService {
  private http = inject(HttpClient);

  private API_URL = environment.API_URL;
  async getTrucks(page: number): Promise<TruckResponse> {
    try {
      const params = new HttpParams().set('page', page.toString());

      const response = await lastValueFrom(
        this.http.get<TruckResponse>(`${this.API_URL}/trucks`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los camiones:', error);
      throw error;
    }
  }

  async getTrucksList(): Promise<Truck[]> {
    try {
      return await lastValueFrom(
        this.http.get<Truck[]>(`${this.API_URL}/trucks/Complet-List`)
      );
    } catch (error) {
      console.error('Error al obtener los camiones:', error);
      throw error;
    }
  }

  async addTruck(truck: Truck): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.API_URL}/trucks`, truck)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar el camion:', error);
      throw error;
    }
  }
}
