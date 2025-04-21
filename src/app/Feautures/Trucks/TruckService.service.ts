import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import axiosInstance from '../../Core/Config/axios.config';

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
      const response = await axiosInstance.get<TruckResponse>('/trucks', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al obtener los camiones:', error);
        throw error;
      }
    }
  }

  async getTrucksList(): Promise<Truck[]> {
    try {
      const response = await axiosInstance.get<Truck[]>('/trucks/Complet-List');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al obtener los camiones:', error);
        throw error;
      }
    }
  }

  async addTruck(truck: Truck): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        '/trucks',
        truck
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al agregar el camión:', error);
        throw error;
      }
    }
  }

  async disableTruck(plate: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        `/trucks/disable/${plate}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al deshabilitar el camión:', error);
        throw error;
      }
    }
  }

  async editTruck(truck: Truck): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        `/trucks`,
        truck
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al editar el camión:', error);
        throw error;
      }
    }
  }
}
