import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
@Component({
  selector: 'custom-input-mask',
  templateUrl: './custom-input-mask.component.html',
  standalone: true,
  imports: [CommonModule, NgxMaskModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMaskComponent),
      multi: true,
    },
  ],
})
export default class CustomInputMaskComponent implements ControlValueAccessor {
  @Input() control: FormControl;
  @Input() placeholder: FormControl;
  @Input() label: string;
  @Input() customMask: string;
  @Input() horizontal: boolean = true;
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = false;
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
