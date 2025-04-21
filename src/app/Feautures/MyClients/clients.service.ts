import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import axios from 'axios';
import axiosInstance from '../../Core/Config/axios.config';

interface Client {
  name: string;
}

interface ClientResponse {
  data: Client[];
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  async getClients(page: number): Promise<ClientResponse> {
    try {
      const response = await axiosInstance.get<ClientResponse>('/clients', {
        params: { page: page.toString() },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error al obtener los clientes:',
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message || 'Error al obtener los clientes'
        );
      } else {
        console.error('Error desconocido al obtener los clientes:', error);
        throw error;
      }
    }
  }

  async getClientList(): Promise<Client[]> {
    try {
      const response = await axiosInstance.get<Client[]>(
        '/clients/Complet-List'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error al obtener la lista de clientes:',
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            'Error al obtener la lista de clientes'
        );
      } else {
        console.error(
          'Error desconocido al obtener la lista de clientes:',
          error
        );
        throw error;
      }
    }
  }

  async addClient(client: Client): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.post<{ message: string }>(
        '/clients',
        client
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error al agregar el cliente:',
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message || 'Error al agregar el cliente'
        );
      } else {
        console.error('Error desconocido al agregar el cliente:', error);
        throw error;
      }
    }
  }

  async disableClient(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        `/clients/disable/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error al deshabilitar el cliente:',
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message || 'Error al deshabilitar el cliente'
        );
      } else {
        console.error('Error desconocido al deshabilitar el cliente:', error);
        throw error;
      }
    }
  }
  async editClient(client: Client): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        `/clients`,
        client
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error al editar el cliente:',
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message || 'Error al editar el cliente'
        );
      } else {
        console.error('Error desconocido al editar el cliente:', error);
        throw error;
      }
    }
  }
}
