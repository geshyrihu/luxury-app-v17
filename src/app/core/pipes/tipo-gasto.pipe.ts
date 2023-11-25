import { Pipe, PipeTransform } from '@angular/core';
import { ETipoGasto } from '../enums/tipo-gasto.enum';
import { onGetSelectItemFromEnum } from '../helpers/enumeration';

@Pipe({
  name: 'eTipoGasto',
  standalone: true,
})
export class ETipoGastoPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(ETipoGasto);
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
