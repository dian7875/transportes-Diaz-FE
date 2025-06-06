import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import axiosInstance from '../../Core/Config/axios.config';
import axios from 'axios';
import { ResponseData, newTravel } from './Travel';


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

  async getFilterTravels(
    page: number,
    filters: {
      client_id: number;
      truck_plate?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<ResponseData> {
    try {
      let params = new HttpParams().set('page', page.toString());

      if (filters.truck_plate)
        params = params.set('truck_plate', filters.truck_plate);
      if (filters.client_id)
        params = params.set('client_id', filters.client_id);
      if (filters.startDate)
        params = params.set(
          'startDate',
          filters.startDate.toISOString().split('T')[0]
        );
      if (filters.endDate)
        params = params.set(
          'endDate',
          filters.endDate.toISOString().split('T')[0]
        );

      const response = await lastValueFrom(
        this.http.get<ResponseData>(`${this.API_URL}/travels/filters`, {
          params,
        })
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

  async DeleteTravel(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        `/travels/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al editar el conductor:', error);
        throw error;
      }
    }
  }
}
