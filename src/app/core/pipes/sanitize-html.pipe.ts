import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true,
})
export class SanitizeHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return ''; // Devuelve un valor por defecto si es null o undefined
    }
    // Continúa con el procesamiento si `value` es válido
    return value.replace(/<\/?[^>]+(>|$)/g, ''); // Ejemplo de eliminación de etiquetas HTML
  }
}
