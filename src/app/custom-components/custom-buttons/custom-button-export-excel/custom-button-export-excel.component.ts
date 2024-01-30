import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbTooltip],
  selector: 'custom-button-export-excel',
  standalone: true,
  templateUrl: './custom-button-export-excel.component.html',
})
export default class CustomButtonExportExcelComponent {
  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
