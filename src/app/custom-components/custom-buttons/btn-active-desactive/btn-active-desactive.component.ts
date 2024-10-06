import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-active-desactive',
  templateUrl: './btn-active-desactive.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class BtnActiveDesactiveComponent {
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
