import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'custom-button-add',
  standalone: true,
  templateUrl: './custom-button-add.component.html',
})
export default class CustomButtonAddComponent {
  @Output() clicked = new EventEmitter<void>();

  onClick(envent: any) {
    this.clicked.emit(envent);
  }
}
