import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-button-download-file',
  templateUrl: './custom-button-download-file.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltip],
})
export default class CustomButtonDownloadFileComponent {
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() customNgClass: any;
  @Input() label = '';
  @Input() ngbTooltip: string = '';
  @Input() placement: string = 'top';

  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
