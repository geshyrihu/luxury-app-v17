import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
    selector: 'custom-input-time',
    templateUrl: './custom-input-time.component.html',
    imports: [
        LuxuryAppComponentsModule,
        FormsModule,
        CommonModule,
        FlatpickrModule,
        ValidationErrorsCustomInputComponent,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomInputTimeComponent),
            multi: true,
        },
    ]
})
export default class CustomInputTimeComponent implements ControlValueAccessor {
  constructor() {
    flatpickrFactory();
  }
  @Input() control: FormControl;
  @Input() hidden: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() placeholder: string;

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
