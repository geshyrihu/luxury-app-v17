import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'new-line',
  standalone: true,
})
export default class NewLinePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br>');
  }
}
