import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import CustomButtonComponent from '../custom-button/custom-button.component';

@Component({
  selector: 'custom-button-edit',
  templateUrl: './custom-button-edit.component.html',
  standalone: true,
  imports: [NgbTooltip, CustomButtonComponent],
})
export default class CustomButtonEditComponent {
  @Input() placement: string = 'top';
  @Input() customClass: string = '';
  @Output() edit = new EventEmitter<any>();
  onClick(value: any) {
    this.edit.emit(value);
  }
}
