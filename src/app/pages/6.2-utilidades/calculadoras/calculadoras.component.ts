import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
@Component({
  selector: 'app-calculadoras',
  templateUrl: './calculadoras.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CalculadorasComponent {
  precio: number = 0;
  precioSinIva: number = 0;
  iva: number = 0;
  calcularPrecioSinIva() {
    (this.precioSinIva = this.precio / 1.16), 2;
    this.iva = (this.precioSinIva * 16) / 100;
  }
}
