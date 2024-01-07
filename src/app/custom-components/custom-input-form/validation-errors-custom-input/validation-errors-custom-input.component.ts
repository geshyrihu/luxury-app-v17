import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-errors-custom-input',
  templateUrl: './validation-errors-custom-input.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class ValidationErrorsCustomInputComponent {
  @Input() control: FormControl;

  @Input() placeholder: string;

  shouldShowErrors(): boolean {
    return (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  getErrors(): string[] {
    return Object.keys(this.control?.errors || {}).map((key: string) => {
      // Customiza los mensajes de error según tus necesidades
      if (key === 'required') {
        return `El campo ${this.placeholder} es requerido.`;
      } else if (key === 'minlength') {
        return `El campo debe de tener minimo
        ${this.control.errors.minlength.requiredLength} caracteres.`;
      } else if (key === 'maxlength') {
        return `El campo debe de tener maximo
        ${this.control.errors.maxlength.requiredLength} caracteres.`;
      } else if (key === 'min') {
        return `Valor minimo requerida: ${this.control.errors[key].requiredLength}`;
      } else if (key === 'max') {
        return `Valor maximo requerida: ${this.control.errors[key].requiredLength}`;
      } else if (key === 'email') {
        return `Ingresa un emal valido`;
      } else if (key === 'pattern') {
        return `El formato de ${this.placeholder} es inválido.`;
      }
    });
  }
}
