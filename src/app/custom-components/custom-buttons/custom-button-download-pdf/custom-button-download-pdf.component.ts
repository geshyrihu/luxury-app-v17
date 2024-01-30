import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  imports: [NgbTooltipModule],
  selector: 'custom-button-download-pdf',
  standalone: true,
  templateUrl: './custom-button-download-pdf.component.html',
})
export default class CustomButtonDownloadPdfComponent {
  urlBase = environment.base_urlImg;

  @Input()
  urlFile: string = '';
}
