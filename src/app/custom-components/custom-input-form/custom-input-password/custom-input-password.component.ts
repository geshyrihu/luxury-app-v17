import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
  selector: 'custom-input-password',
  templateUrl: './custom-input-password.component.html',
  standalone: true,
  imports: [CommonModule, ValidationErrorsCustomInputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputPasswordComponent),
      multi: true,
    },
  ],
})
export default class CustomInputPasswordComponent
  implements ControlValueAccessor
{
  @Input() control: FormControl;
  @Input() hidden: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() customClass: string = '';

  value: any;
  onChange: any;
  onTouch: any;
  disabled: boolean;
  fieldTextType!: boolean;

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
  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
