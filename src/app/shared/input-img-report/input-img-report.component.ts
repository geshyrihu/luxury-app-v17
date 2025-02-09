import {} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';

@Component({
  selector: 'app-input-img-report',
  templateUrl: './input-img-report.component.html',
  standalone: true,
})
export default class InputImgReportComponent {
  imgBase64: string | null = null;
  //Ingresamos la imagen actual
  @Input()
  urlImgCurrent: string | null = null;

  @Input()
  title: string = '';

  @Output()
  fileSelected: EventEmitter<File> = new EventEmitter<File>();

  change(event: any): void {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      imageToBase64(file)
        .then((value: string) => {
          this.imgBase64 = value;
        })
        .catch((error) => console.log(error));
      this.fileSelected.emit(file);
    }
  }
}
