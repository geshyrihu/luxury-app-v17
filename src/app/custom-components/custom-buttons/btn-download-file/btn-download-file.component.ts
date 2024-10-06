import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [CommonModule, NgbTooltip],
  selector: 'btn-download-file',
  standalone: true,
  templateUrl: './btn-download-file.component.html',
})
export default class BtnDownloadFileComponent {
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
