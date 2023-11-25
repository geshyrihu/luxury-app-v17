import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-button-roles',
  templateUrl: './custom-button-roles.component.html',
  standalone: true,
  imports: [NgbTooltip],
})
export default class CustomButtonRolesComponent {
  @Output()
  editarRole = new EventEmitter<string>();

  onClick(event: string): void {
    return this.editarRole.emit(event);
  }
}
