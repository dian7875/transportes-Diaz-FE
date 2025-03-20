import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Driver {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  status: boolean;
}

interface Truck {
  plate: string;
  name: string;
}

interface Client {
  id: number;
  name: string;
}

interface Travel {
  id: number;
  travelCode: string;
  destination: string;
  noIVAmount: number;
  withIVAmount: number;
  IVAmount: number;
  travelDate: string;
  driver: Driver;
  truck: Truck;
  client: Client;
}

interface ResponseData {
  data: Travel[];
  count: number;
}

interface newTravel {
  travelCode: string;
  destination: string;
  noIVAmount: number;
  withIVAmount: number;
  travelDate: string;
  driver_id: number;
  truck_plate: string;
  client_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class TravelService {

  private http = inject(HttpClient);

  private API_URL = environment.API_URL;

  async getTravels(page: number): Promise<ResponseData> {
    try {
      const params = new HttpParams().set('page', page.toString());

      const response = await lastValueFrom(
        this.http.get<ResponseData>(`${this.API_URL}/travels`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los transportes:', error);
      throw error;
    }
  }


    async getFilterTravels(page: number, filters: { client_id:number,truck_plate?: string; startDate?: Date; endDate?: Date }): Promise<ResponseData> {
      try {
        let params = new HttpParams().set('page', page.toString());
        
        if (filters.truck_plate) params = params.set('truck_plate', filters.truck_plate);
        if (filters.client_id) params = params.set('client_id', filters.client_id);
        if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString().split('T')[0]); 
        if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString().split('T')[0]);
  
        const response = await lastValueFrom(
          this.http.get<ResponseData>(`${this.API_URL}/travels/filters`, { params })
        );
        return response;
      } catch (error) {
        console.error('Error al obtener los transportes:', error);
        throw error;
      }
    }

  async addTravel(travel: newTravel): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.API_URL}/travels`, travel)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar el transporte:', error);
      throw error;
    }
  }
}

