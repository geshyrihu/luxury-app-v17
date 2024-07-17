import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true,
})
export class SanitizeHtmlPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  // transform(v: string): SafeHtml {
  //   return this._sanitizer.bypassSecurityTrustHtml(v);
  // }
  transform(value: string): string {
    return value.replace(/\n/g, '<br>');
  }
}
