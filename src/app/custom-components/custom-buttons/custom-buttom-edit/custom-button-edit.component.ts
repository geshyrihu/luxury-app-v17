import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbTooltip],
  selector: 'custom-button-edit',
  standalone: true,
  templateUrl: './custom-button-edit.component.html',
})
export default class CustomButtonEditComponent {
  @Input() placement: string = 'top';
  @Input() customClass: string = '';
  @Output() edit = new EventEmitter<any>();
  onClick(value: any) {
    this.edit.emit(value);
  }
}
