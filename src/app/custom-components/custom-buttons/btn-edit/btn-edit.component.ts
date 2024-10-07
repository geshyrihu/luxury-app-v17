import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import BtnComponent from '../a-master-btn-button/a-master-btn.component';

@Component({
  selector: 'btn-edit',
  templateUrl: './btn-edit.component.html',
  standalone: true,
  imports: [NgbTooltip, BtnComponent],
})
export default class BtnEditComponent {
  @Input() placement: string = 'top';
  @Input() customClass: string = '';
  @Output() edit = new EventEmitter<any>();
  onClick(value: any) {
    this.edit.emit(value);
  }
}
