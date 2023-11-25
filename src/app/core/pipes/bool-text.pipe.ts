import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eBoolText',
  standalone: true,
})
export class EBoolTextPipe implements PipeTransform {
  transform(value: boolean): string {
    let dato: string = '';
    if (value === false) {
      dato = 'No';
    } else {
      dato = 'Si';
    }
    return dato;
  }
}
