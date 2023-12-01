import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';
@Component({
  selector: 'custom-input-text-area',
  templateUrl: './custom-input-textarea.component.html',
  standalone: true,
  imports: [CommonModule, ValidationErrorsCustomInputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputTextAreaComponent),
      multi: true,
    },
  ],
})
export default class CustomInputTextAreaComponent
  implements ControlValueAccessor
{
  @Input() control: FormControl;
  @Input() disableResize: boolean;
  @Input() hidden: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() placeholder: string;

  value: any;
  onChange: any;
  onTouch: any;
  disabled: boolean;

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
