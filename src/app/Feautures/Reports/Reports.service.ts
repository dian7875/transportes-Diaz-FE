import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';

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
      const errorMessage = (error as HttpErrorResponse).error;
      const errorText = await errorMessage.text();
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message);
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
