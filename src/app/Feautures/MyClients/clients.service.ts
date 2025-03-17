import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private http = inject(HttpClient);

  private API_URL = environment.API_URL;

  async getClients(page: number): Promise<ClientResponse> {
    try {
      const params = new HttpParams().set('page', page.toString());

      const response = await lastValueFrom(
        this.http.get<ClientResponse>(`${this.API_URL}/clients`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw error;
    }
  }

  async addClient(client: Client): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.API_URL}/clients`, client)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar el cliente:', error);
      throw error;
    }
  }
}
