import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { filter, lastValueFrom } from 'rxjs';

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

  async downloadLoanReport(filter: filter) {
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
      console.error('Error al generar reporte:', error);
      throw error;
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
