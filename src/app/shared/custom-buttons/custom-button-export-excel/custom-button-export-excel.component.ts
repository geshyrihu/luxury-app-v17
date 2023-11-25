import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-button-export-excel',
  templateUrl: './custom-button-export-excel.component.html',
  standalone: true,
  imports: [NgbTooltip],
})
export default class CustomButtonExportExcelComponent {
  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
