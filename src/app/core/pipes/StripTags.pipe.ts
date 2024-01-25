// En tu archivo .ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'striptags',
  standalone: true,
})
export default class StripTagsPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/<[^>]*>/g, '') : '';
  }
}
