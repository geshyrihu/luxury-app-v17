import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  imports: [],
  selector: 'custom-button-download-pdf',
  standalone: true,
  templateUrl: './custom-button-download-pdf.component.html',
})
export default class CustomButtonDownloadPdfComponent {
  urlBase = environment.base_urlImg;

  @Input()
  urlFile: string = '';
}
