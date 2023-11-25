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

export function flatpickrFactory() {
  flatpickr.localize(Spanish);
  return flatpickr;
}
@Component({
  selector: 'custom-input-date',
  templateUrl: './custom-input-date.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, FlatpickrModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputDateComponent),
      multi: true,
    },
  ],
})
export default class CustomInputDateComponent implements ControlValueAccessor {
  @Input() control: FormControl;
  @Input() horizontal: boolean = true;
  @Input() disabled: boolean = false;
  @Input() placeholder: string;
  @Input() label: string;
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

  handleFlatpickrChange(selectedDates: Date[]) {
    const date =
      selectedDates.length > 0
        ? selectedDates[0].toISOString().split('T')[0]
        : null;
    this.value = date;
    this.onChange(date);
    this.onTouched();
  }
}
