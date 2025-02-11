import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import CustomBtnComponent from '../custom-button-button/custom-button.component';

@Component({
    selector: 'btn-edit',
    templateUrl: './btn-edit.component.html',
    imports: [NgbTooltip, CustomBtnComponent, CommonModule]
})
export default class BtnEditComponent {
  @Input() placement: string = 'top';
  @Input() customClass: string = '';

  @Output() edit = new EventEmitter<any>();

  onClick(value: any) {
    this.edit.emit(value);
  }
}
