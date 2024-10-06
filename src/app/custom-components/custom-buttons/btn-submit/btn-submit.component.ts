import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'btn-submit',
  templateUrl: './btn-submit.component.html',
  standalone: true,
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
