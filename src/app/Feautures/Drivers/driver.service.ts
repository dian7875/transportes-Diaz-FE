import { Injectable } from '@angular/core';
import axiosInstance from '../../Core/Config/axios.config';
import axios from 'axios';
import { DriverResponse, Driver } from './Drivers';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  async getDrivers(page: number): Promise<DriverResponse> {
    try {
      const response = await axiosInstance.get<DriverResponse>('/drivers', {
        params: { page },
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener los camiones:', error);
      throw error;
    }
  }

  async getDriversList(): Promise<Driver[]> {
    try {
      const response = await axiosInstance.get<Driver[]>(
        '/drivers/Complet-List'
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener los conductores:', error);
      throw error;
    }
  }

  async addDriver(driver: Driver): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        '/drivers',
        driver
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(error.response?.data.message);
        throw Error(error.response?.data.message);
      } else {
        console.error('Error al agregar el conductor:', error);
        throw error;
      }
    }
  }

  async patchDriver(driver: Driver): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        '/drivers',
        driver
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

  async disableDriver(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        `/drivers/disable/${id}`
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
