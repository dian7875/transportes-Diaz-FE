import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import axiosInstance from '../../Core/Config/axios.config';

interface filter {
  startDate?: string;
  endDate?: string;
  truck_plate?: string;
  client_id?: string;
  reportType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HttpClient);

  private API_URL = environment.API_URL;

  async downloadReport(filter: filter) {
    try {
      const response = await lastValueFrom(
        this.http.post(
          `${this.API_URL}/Reports/download-${filter.reportType}-report`,
          {
            startDate: filter.startDate || '',
            endDate: filter.endDate || '',
            client_id: filter.client_id || '',
            truck_plate: filter.truck_plate || '',
          },
          {
            responseType: 'blob',
            observe: 'response',
          }
        )
      );
      const contentDisposition = response.headers.get('content-disposition');
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : 'Reporte.pdf';
      this.downloadFile(response.body!, fileName);
    } catch (error) {
      const errorMessage = (error as HttpErrorResponse).error;
      const errorText = await errorMessage.text();
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message);
    }
  }

  async downloadExcel(client_id:number) {

    try {
      const response = await axiosInstance.post(
        '/Reports/GenerateXLSX',
        {
          client_id: client_id || '',
        },
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', `Facturas_Pendientes_${new Date().toLocaleDateString()}.xlsx`);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type.includes('application/json')
      ) {
        const errorText = await error.response.data.text();

        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          throw new Error('Error al interpretar la respuesta del servidor');
        }
        throw new Error(errorJson.message || 'Error del servidor');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }



  }

  downloadFile = (data: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
}
