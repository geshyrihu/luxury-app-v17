import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'btn-download-pdf',
  templateUrl: './btn-download-pdf.component.html',
  standalone: true,
})
export default class BtnDownloadPdfComponent {
  urlBase = environment.base_urlImg;

  @Input()
  urlFile: string = '';
}
