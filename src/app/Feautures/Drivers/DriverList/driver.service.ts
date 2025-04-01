import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom} from 'rxjs';
import { environment } from '../../../../environments/environments';

interface Driver {
  id: number;
  name: string;
  startDate: Date;
  endDate?: Date;
  status: boolean;
}

interface DriverResponse {
  data: Driver[];
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  private http = inject(HttpClient);

  private API_URL = environment.API_URL;

  async getDrivers(page: number): Promise<DriverResponse> {
    try {
      const params = new HttpParams().set('page', page.toString());

      const response = await lastValueFrom(
        this.http.get<DriverResponse>(`${this.API_URL}/drivers`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los camiones:', error);
      throw error;
    }
  }

  async getDriversList(): Promise<Driver[]> {
    try {
      return await lastValueFrom(
        this.http.get<Driver[]>(`${this.API_URL}/drivers/Complet-List`)
      );
    } catch (error) {
      console.error('Error al obtener los conductores:', error);
      throw error;
    }
  }

  async addDriver(truck: Driver): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.API_URL}/drivers`, truck)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar el camion:', error);
      throw error;
    }
  }
}
