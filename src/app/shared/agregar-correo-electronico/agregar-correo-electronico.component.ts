import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-agregar-correo-electronico',
  templateUrl: './agregar-correo-electronico.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
})
export default class AgregarCorreoElectronicoComponent {
  email: string = '';
  mailValido: boolean = false;

  constructor(public ref: DynamicDialogRef) {}
  esEmailValido(): void {
    ('use strict');
    var EMAIL_REGEX =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (this.email.match(EMAIL_REGEX)) {
      this.mailValido = true;
    }
  }

  onAgregarEmail() {
    this.ref.close(this.email);
  }
}
