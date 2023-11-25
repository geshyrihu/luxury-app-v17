import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calculadoras',
  templateUrl: './calculadoras.component.html',
  standalone: true,
  imports: [NgbAlert, FormsModule],
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
