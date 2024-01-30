import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'custom-button-dropdown-item',
  standalone: true,
  templateUrl: './custom-buttom-dropdown-item.component.html',
})
export default class CustomButtomDropdownItemComponent {
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() customNgClassIcon: string = '';
  @Input() customNgClass: any;
  @Input() icon = '';
  @Input() label = '';

  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
