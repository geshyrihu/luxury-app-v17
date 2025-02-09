import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';

@Component({
  selector: 'custom-input-img',
  templateUrl: './custom-input-img.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgStyle],
})
export default class CustomInputImgComponent {
  imgBase64: string = '';

  //Ruta de Imagen por defecto
  noImg = `assets/images/no-image.png`;

  //Ingresamos la imagen actual
  @Input()
  urlImgCurrent: string = '';
  @Input()
  title: string = '';

  private _contentHeight: number = 100; // Valor por defecto en píxeles
  private _contentWidth: number = 150; // Valor por defecto en píxeles

  @Input()
  set contentHeight(value: string | number) {
    this._contentHeight =
      typeof value === 'string' ? parseInt(value, 10) : value;
  }

  @Input()
  set contentWidth(value: string | number) {
    this._contentWidth =
      typeof value === 'string' ? parseInt(value, 10) : value;
  }

  get contentHeight() {
    return this._contentHeight;
  }

  get contentWidth() {
    return this._contentWidth;
  }

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
    let result: boolean = false;
    if (url) {
      const parts = url.split('/');
      const lastPart = parts.pop();

      if (lastPart == 'null') {
        result = true;
      } else {
        result = false;
      }
    }
    return result;
  }
}
