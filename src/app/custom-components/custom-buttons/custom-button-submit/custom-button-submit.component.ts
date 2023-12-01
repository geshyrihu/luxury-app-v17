import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-button-submit',
  templateUrl: './custom-button-submit.component.html',
  standalone: true,
  imports: [NgClass],
})
export default class CustomButtonSubmitComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  nameLabel = 'Guardar';
  @Input()
  icon = 'fa-thin fa-floppy-disk';
}
