import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'celularNumber',
  standalone: true,
})

export class CelularNumberPipe implements PipeTransform {
  transform(value: string): string {    // Elimina todos los caracteres no numéricos
    const numericValue = value.replace(/\D/g, '');

    // Verifica si la longitud del número es igual a 9
    if (numericValue.length === 9) {
      // Formatea el número con guiones
      const firstPart = numericValue.slice(0, 2);
      const secondPart = numericValue.slice(2, 6);
      const thirdPart = numericValue.slice(6, 9);
      return `${firstPart}-${secondPart}-${thirdPart}`;
    } else {
      // En caso de que el número no tenga 9 dígitos, retorna el valor original sin cambios
      return value;
    }
  }
}
