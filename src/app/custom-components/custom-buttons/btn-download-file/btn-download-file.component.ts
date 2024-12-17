import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'btn-download-file',
  templateUrl: './btn-download-file.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltip],
})
export default class BtnDownloadFileComponent {
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() customNgClass: any;
  @Input() label = '';
  @Input() ngbTooltip: string = 'Descargar PDF';
  @Input() download: string = 'dile.pdf';
  @Input() placement: string = 'top';
  @Input() urlFile: string = ''; // URL del archivo a descargar

  onClick(event: any) {
    // Llamamos a la función para descargar el archivo
    console.log('🚀 ~ this.urlFile:', this.urlFile);
    this.downloadFile(this.urlFile);
  }

  private downloadFile(url: string) {
    console.log('🚀 ~ url:', url);
    if (!url) {
      console.error('URL no proporcionada.');
      return;
    }

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', ''); // El nombre del archivo se tomará de la URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getFileName(url: string): string {
    return url ? url.split('/').pop() || 'archivo' : 'archivo';
  }
}
