import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'custom-button-dropdown-item',
  templateUrl: './custom-buttom-dropdown-item.component.html',
  standalone: true,
  imports: [CommonModule],
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
