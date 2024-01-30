import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [NgClass],
  selector: 'custom-button-submit',
  standalone: true,
  templateUrl: './custom-button-submit.component.html',
})
export default class CustomButtonSubmitComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  nameLabel = 'Guardar';
  @Input()
  icon = 'fa-thin fa-floppy-disk';
}
