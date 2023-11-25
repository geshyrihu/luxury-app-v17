import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export default class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remover todos los caracteres que no sean dígitos (0-9)
    const cleanedValue = value.replace(/\D/g, '');

    // Aplicar el formato requerido (XX) XXXX-XXXX
    const areaCode = cleanedValue.substring(0, 2);
    const firstPart = cleanedValue.substring(2, 6);
    const secondPart = cleanedValue.substring(6);

    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }
}
