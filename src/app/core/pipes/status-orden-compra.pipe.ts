import { Pipe, PipeTransform } from '@angular/core';
import { EStatusOrdenCompra } from '../enums/estatus-orden-compra.enum';
import { onGetSelectItemFromEnum } from '../helpers/enumeration';

@Pipe({
  name: 'eStatusOrdenCompra',
  standalone: true,
})
export class EStatusOrdenCompraPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EStatusOrdenCompra);
  transform(value: unknown): string {
    let dato: string = '';
    if (value === null) {
      dato = '';
    } else {
      this.enum.forEach((item) => {
        if (value === item.value) {
          dato = item.label;
        }
      });
    }
    return dato;
  }
}
