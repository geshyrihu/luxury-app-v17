import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leyohm',
  templateUrl: './leyohm.component.html',
  standalone: true,
  imports: [FormsModule],
})
export default class LeyohmComponent {
  volts: number = 0;
  amperes: number = 0;
  resistencia: number = 0;

  verVoltaje: boolean = false;
  verAmperaje: boolean = false;
  verResistencia: boolean = false;

  calcularVoltaje() {
    const resultado = this.resistencia * this.amperes;
    this.volts = Math.round((resultado + Number.EPSILON) * 100) / 100;
  }
  calcularCorriente() {
    const resultado = this.volts / this.resistencia;
    this.amperes = Math.round((resultado + Number.EPSILON) * 100) / 100;
  }
  calcularResistencia() {
    const resultado = this.volts / this.amperes;
    this.resistencia = Math.round((resultado + Number.EPSILON) * 100) / 100;
  }

  onVoltaje() {
    this.verVoltaje = true;
    this.verAmperaje = false;
    this.verResistencia = false;
  }
  onAmperaje() {
    this.verVoltaje = false;
    this.verAmperaje = true;
    this.verResistencia = false;
  }
  onResistencia() {
    this.verVoltaje = false;
    this.verAmperaje = false;
    this.verResistencia = true;
  }
}
