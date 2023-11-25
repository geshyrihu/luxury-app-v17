import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'custom-input-img',
  templateUrl: './custom-input-img.component.html',
  standalone: true,
  imports: [NgIf, NgStyle],
})
export default class CustomInputImgComponent {
  imgBase64: string = '';

  //Ruta de Imagen por defecto
  noImg = `${environment.base_urlImg}no-img.png`;

  //Ingresamos la imgan actual
  @Input()
  urlImgCurrent: string = '';
  @Input()
  title: string = '';
  @Input()
  contentHeight: string = '150px';
  @Input()
  contentWidth: string = '250px';

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

  onValidateImgCurrent(): boolean {
    const url = this.urlImgCurrent;

    let result:boolean=false;
    if (url) {
      const parts = url.split('/');
      const lastPart = parts.pop();

      if (lastPart == 'null') {
        result= true;
      } else {
        result= false;
      }
    }
    return result;
  }
}
