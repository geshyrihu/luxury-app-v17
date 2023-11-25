import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'custom-input-password',
  templateUrl: './custom-input-password.component.html',
  standalone: true,
  imports: [CommonModule],
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
  @Input() placeholder: FormControl;
  @Input() label: string;
  @Input() horizontal: boolean = true;

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
