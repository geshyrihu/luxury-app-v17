import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-route',
  templateUrl: './dropdown-route.component.html',
  standalone: true,
  imports: [],
})
export default class DropdownRouteComponent {
  @Input()
  icon: string = '';

  @Input()
  name: string = '';

  @Output()
  event = new EventEmitter<any>();
  onClick(value: any) {
    this.event.emit(value);
  }
}
