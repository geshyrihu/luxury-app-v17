import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';
export function flatpickrFactory() {
  flatpickr.localize(Spanish);
  return flatpickr;
}
@Component({
  selector: 'custom-input-hour',
  standalone: true,
  templateUrl: './custom-input-hour.component.html',
  imports: [
    FormsModule,
    CommonModule,
    FlatpickrModule,
    ValidationErrorsCustomInputComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputHourComponent),
      multi: true,
    },
  ],
})
export default class CustomInputHourComponent implements ControlValueAccessor {
  @Input() control: FormControl;
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() placeholder: string;

  constructor() {
    flatpickrFactory();
  }
  value: string;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
