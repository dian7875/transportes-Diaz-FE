import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import axiosInstance from '../../Core/Config/axios.config';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  async getStats(date?: Date): Promise<{ expenses: number; produced: number }> {
    try {
      const params = { week: date?.toString() || '' };
      const response = await axiosInstance.get<{
        expenses: number;
        produced: number;
      }>('/stats', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(error.response?.data.message);
        throw new Error(error.response?.data.message);
      } else {
        console.error('Error al obtener las estadísticas:', error);
        throw error;
      }
    }
  }


  async getTruckStats(
    date?: Date
  ): Promise<{ name: string; series: { name: string; value: number }[] }[]> {
    try {
      const params = { week: date?.toString() || '' };
      const response = await axiosInstance.get<
        { name: string; series: { name: string; value: number }[] }[]
      >('/stats/TruckStats', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(error.response?.data.message);
        throw new Error(error.response?.data.message);
      } else {
        console.error('Error al obtener estadísticas de camiones:', error);
        throw error;
      }
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
      const params = { week: date?.toString() || '' };
      const response = await axiosInstance.get<{
        clients: number;
        drivers: number;
        trucks: number;
        TravelsCount: number;
        productivity: number;
      }>('/stats/counts', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(error.response?.data.message);
        throw new Error(error.response?.data.message);
      } else {
        console.error('Error al obtener conteos generales:', error);
        throw error;
      }
    }
  }
}
