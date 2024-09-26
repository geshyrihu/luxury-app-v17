import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-button',
  standalone: true,
  templateUrl: './custom-button.component.html',
  imports: [CommonModule, NgbTooltip],
})
export default class CustomButtonComponent {
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() customNgClassIcon: string = '';
  @Input() customNgClass: any;
  @Input() icon = '';
  @Input() label = '';
  @Input() ngbTooltipCustom: string = '';
  @Input() placement: string = 'top';
  @Input() type: string = 'button';

  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
