import { Injectable } from '@angular/core';
import axiosInstance from '../../Core/Config/axios.config';
import axios from 'axios';

interface Cotizacion {
  client: {
    clientName: string;
    clientCed: string;
    clientNumber: string;
    clientDirecction: string;
    clientEmail: string;
  };
  items: {
    price: number;
    description: string;
    ivaAmount: number;
    noIvaPrice: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  async generateQuote(payload: Cotizacion) {
    try {
      const response = await axiosInstance.post(
        '/quotes/generate-pdf',
        payload,
        { responseType: 'blob' }
      );
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : 'Cotizacion.pdf';
      this.downloadFile(response.data, fileName);

      return
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data;

        if (errorMessage instanceof Blob) {
          const errorText = await errorMessage.text();
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Error al generar el reporte');
        } else {
          const message =
            errorMessage?.message || 'Error desconocido al procesar el reporte';
          throw new Error(message);
        }
      } else {
        console.error('Error desconocido:', error);
        throw new Error('Error desconocido');
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
