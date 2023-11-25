import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CurrencyMexicoPipe',
  standalone: true,
})
export class CurrencyMexicoPipe implements PipeTransform {

  transform(value: number): string {
    // Verificar si el valor es numérico
    if (isNaN(value)) {
      return '';
    }
    // Formatear el número como moneda en México
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

    return formatter.format(value);
  }
}
