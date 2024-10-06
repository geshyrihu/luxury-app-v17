import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-c-btn-bagges',
  templateUrl: './c-btn-bagges.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltip],
})
export default class CBtnBaggesComponent {
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() customNgClassIcon: string = '';
  @Input() customNgClass: any;
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() ngbTooltipCustom: string = '';
  @Input() placement: string = 'top';
  @Input() count: string = '0';
  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
