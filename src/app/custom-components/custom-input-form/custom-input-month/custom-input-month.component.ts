import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
  selector: 'custom-input-month',
  templateUrl: './custom-input-month.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    ValidationErrorsCustomInputComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMonthComponent),
      multi: true,
    },
  ],
})
export default class CustomInputMonthComponent
  implements ControlValueAccessor, OnInit
{
  @Input() control: FormControl;
  @Input() placeholder: string;
  @Input() horizontal: boolean = true;
  @Input() label: string = '';
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = true;
  value: any;
  onChange: any;
  onTouch: any;
  disabled: boolean;

  ngOnInit(): void {
    this.disabled = this.control.disabled;
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
}
