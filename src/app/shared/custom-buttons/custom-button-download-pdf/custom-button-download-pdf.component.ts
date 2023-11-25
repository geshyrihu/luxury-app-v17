import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'custom-button-download-pdf',
  templateUrl: './custom-button-download-pdf.component.html',
  standalone: true,
  imports: [NgbTooltipModule],
})
export default class CustomButtonDownloadPdfComponent {
  urlBase = environment.base_urlImg;

  @Input()
  urlFile: string = '';
}
