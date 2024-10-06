import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbTooltip],
  selector: 'btn-export-excel',
  standalone: true,
  templateUrl: './btn-export-excel.component.html',
})
export default class BtnExportExcelComponent {
  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
