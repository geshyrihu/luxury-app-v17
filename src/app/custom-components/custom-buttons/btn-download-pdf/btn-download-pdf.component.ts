import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  imports: [],
  selector: 'btn-download-file',
  templateUrl: './btn-download-pdf.component.html',
  standalone: true,
})
export default class BtnDownloadPdfComponent {
  urlBase = environment.base_urlImg;

  @Input()
  urlFile: string = '';
}
