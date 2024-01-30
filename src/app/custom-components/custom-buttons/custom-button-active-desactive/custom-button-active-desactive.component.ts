import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'custom-button-active-desactive',
  standalone: true,
  templateUrl: './custom-button-active-desactive.component.html',
})
export default class CustomButtonActiveDesactiveComponent {
  state: boolean = true;
  @Input() activas: string = 'Activas';
  @Input() inactivas: string = 'Inactivas';
  @Output() activo = new EventEmitter<boolean>();
  @Output() inactivo = new EventEmitter<boolean>();

  onPropagarActivo() {
    this.state = !this.state;
    this.activo.emit(true);
  }

  onPropagarInactivo() {
    this.state = !this.state;
    this.inactivo.emit(false);
  }
}
