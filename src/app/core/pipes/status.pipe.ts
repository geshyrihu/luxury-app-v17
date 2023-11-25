import { Pipe, PipeTransform } from '@angular/core';
import { EStatusTask } from '../enums/estatus-task.enum';
import { onGetSelectItemFromEnum } from '../helpers/enumeration';

@Pipe({
  name: 'eStatus',
  standalone: true,
})
export class EStatusPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EStatusTask);
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
