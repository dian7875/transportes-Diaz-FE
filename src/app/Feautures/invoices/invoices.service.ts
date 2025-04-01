import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';

interface newInvoice {
  invoicesNumber: string;
  invoiceAmount: number;
  dueDate: Date;
  invoiceDate: Date;
  client_id: number;
}

interface invoice {
  id: number;
  invoicesNumber: string;
  invoiceAmount: number;
  invoiceDate: Date;
  dueDate: Date;
}

interface dataRes{
  data:invoice[],
  count:number,
  total:number
}

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor() {}

  private http = inject(HttpClient);

  private API_URL = environment.API_URL;

  async getTravelsAmount(
    client_id: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ total: number }> {
    try {
      const params = new HttpParams()
        .set('client_id', client_id.toString())
        .set('startDate', startDate.toISOString().split('T')[0])
        .set('endDate', endDate.toISOString().split('T')[0]);

      const response = await lastValueFrom(
        this.http.get<{ total: number }>(`${this.API_URL}/invoices`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener total:', error);
      throw error;
    }
  }

  async getInvoices(
    page: number,
    client_id?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<dataRes> {
    try {
      let params = new HttpParams().set('page', page.toString());

      if (client_id) {
        params = params.set('client_id', client_id.toString());
      }

      if (startDate) {
        params = params.set('startDate', startDate.toISOString().split('T')[0]);
      }

      if (endDate) {
        params = params.set('endDate', endDate.toISOString().split('T')[0]);
      }

      const response = await lastValueFrom(
        this.http.get<dataRes>(`${this.API_URL}/invoices/InvoiceList`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener total:', error);
      throw error;
    }
  }

  async addInvoice(invoice: newInvoice): Promise<{ message: string }> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ message: string }>(`${this.API_URL}/invoices`, invoice)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar la factura:', error);
      throw error;
    }
  }
}
