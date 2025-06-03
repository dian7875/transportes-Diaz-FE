import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteService } from './quote.service';
import { from } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  imports: [CommonModule, FormsModule],
})
export class QuotesComponent {
  constructor(
    private quoteService: QuoteService,
    private toast: HotToastService
  ) {
    this.items = [
      {
        price: 0,
        description: '',
        ivaAmount: 0,
        noIvaPrice: 0,
      },
    ];
  }

  client = {
    clientName: '',
    clientCed: '',
    clientNumber: '',
    clientDirecction: '',
    clientEmail: '',
  };

  items: {
    price: number;
    description: string;
    ivaAmount: number;
    noIvaPrice: number;
  }[] = [];

  totalIVA = 0;
  totalGeneral = 0;

  agregarItem() {
    this.items.unshift({
      description: '',
      noIvaPrice: 0,
      ivaAmount: 0,
      price: 0,
    });
    this.recalcularTotales();
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
    this.recalcularTotales();
  }

  recalcular(index: number) {
    const ivaPorcentaje = 0.13;
    const item = this.items[index];
    item.ivaAmount = +(item.noIvaPrice * ivaPorcentaje).toFixed(2);
    item.price = +(item.noIvaPrice + item.ivaAmount).toFixed(2);
    this.recalcularTotales();
  }

  recalcularTotales() {
    this.totalIVA = this.items.reduce((sum, item) => sum + item.ivaAmount, 0);
    this.totalGeneral = this.items.reduce((sum, item) => sum + item.price, 0);
  }
  resetFormulario() {
    this.client = {
      clientName: '',
      clientCed: '',
      clientNumber: '',
      clientDirecction: '',
      clientEmail: '',
    };

    this.items = [
      {
        price: 0,
        description: '',
        ivaAmount: 0,
        noIvaPrice: 0,
      },
    ];
  }

  async generarCotizacion() {
    const payload = {
      client: this.client,
      items: this.items,
    };
    from(this.quoteService.generateQuote(payload))
      .pipe(
        this.toast.observe({
          loading: 'Generando, por favor espere...',
          success: () => {
            this.resetFormulario();
            this.recalcularTotales();
            return 'Generado correctamente';
          },
          error: (error) => {
            const errorMessage =
              (error as { message?: string }).message || 'Error desconocido';
            return `Error al generar: ${errorMessage}`;
          },
        })
      )
      .subscribe(() => {});
  }
}
