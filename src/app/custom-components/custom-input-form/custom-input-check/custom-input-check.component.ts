import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
    imports: [CommonModule, ValidationErrorsCustomInputComponent],
    selector: 'custom-input-check',
    templateUrl: './custom-input-check.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomInputCheckComponent),
            multi: true,
        },
    ]
})
export default class CustomInputCheckComponent implements ControlValueAccessor {
  @Input() control: FormControl;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() hidden: boolean = true;
  @Input() customFormlabel: string = '';
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
}
