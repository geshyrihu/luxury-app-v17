import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import CustomBtnComponent from '../custom-button-button/custom-button.component';

@Component({
    selector: 'btn-submit',
    templateUrl: './btn-submit.component.html',
    imports: [NgClass, ButtonModule, CustomBtnComponent]
})
export default class BtnSubmitComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  nameLabel = 'Guardar';
  @Input()
  icon = 'fa-thin fa-floppy-disk';
}
