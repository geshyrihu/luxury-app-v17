import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class InputImgComponent {
  @Input() urlImgCurrent: string = '';
  @Input() title: string = '';
  @Input() contentHeight: string = '150px';
  @Input() contentWidth: string = '250px';

  @Output() fileSelected = new EventEmitter<File>();

  imgBase64: string = '';
  // noImg: string = `${environment.base_urlImg}no-img.png`;

  change(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.convertToBase64(file)
        .then((value: string) => {
          this.imgBase64 = value;
        })
        .catch((error) => console.error(error));
      this.fileSelected.emit(file);
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
