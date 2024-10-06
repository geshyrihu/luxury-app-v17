import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'custom-button-submit',
  standalone: true,
  templateUrl: './custom-button-submit.component.html',
  imports: [NgClass, ButtonModule],
})
export default class BtnSubmitComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  nameLabel = 'Guardar';
  @Input()
  icon = 'fa-thin fa-floppy-disk';
}
