import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import BtnComponent from '../a-master-btn-button/a-master-btn.component';
@Component({
  selector: 'btn-submit',
  templateUrl: './btn-submit.component.html',
  standalone: true,
  imports: [NgClass, ButtonModule, BtnComponent],
})
export default class BtnSubmitComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  nameLabel = 'Guardar';
  @Input()
  icon = 'fa-thin fa-floppy-disk';
}
