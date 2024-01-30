import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbTooltip],
  selector: 'custom-button-roles',
  standalone: true,
  templateUrl: './custom-button-roles.component.html',
})
export default class CustomButtonRolesComponent {
  @Output()
  editarRole = new EventEmitter<string>();

  onClick(event: string): void {
    return this.editarRole.emit(event);
  }
}
