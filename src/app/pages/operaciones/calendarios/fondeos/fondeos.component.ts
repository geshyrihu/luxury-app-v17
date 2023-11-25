import { Component } from '@angular/core';
// import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-fondeos',
  templateUrl: './fondeos.component.html',
  standalone: true,
  imports: [],
})
export default class FondeosComponent {
  descargarPDF() {
    const url = 'assets/documents/FONDEOS2023.pdf'; // Ruta al archivo PDF
    window.open(url, '_blank');
  }
}
