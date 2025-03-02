import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

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

  private API_URL = 'http://localhost:3000/trucks';

  async getTrucks(): Promise<TruckResponse> {
    try {
      const response = await lastValueFrom(
        this.http.get<TruckResponse>(this.API_URL)
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los camiones:', error);
      throw error;
    }
  }

  async addTruck(truck: Truck): Promise<{message:string}> {
    try {
      const response = await lastValueFrom(
        this.http.post<{message:string}>(this.API_URL, truck)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar el camion:', error);
      throw error;
    }
  }
}
