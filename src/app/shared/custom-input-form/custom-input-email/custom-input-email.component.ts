import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'custom-input-email',
  templateUrl: './custom-input-email.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputEmailComponent),
      multi: true,
    },
  ],
})
export default class CustomInputEmailComponent
  implements ControlValueAccessor, OnInit
{
  @Input() control: FormControl;
  @Input() placeholder: FormControl;
  @Input() horizontal: boolean = true;
  @Input() label: string = '';
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = false;
  value: any;
  onChange: any;
  onTouch: any;
  disabled: boolean;

  ngOnInit(): void {
    this.disabled = this.control.disabled;
    // Agregar validación de patrón de correo electrónico al control
    this.control.setValidators([
      Validators.email,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    ]);
  }
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Otros métodos y lógica del componente
}
