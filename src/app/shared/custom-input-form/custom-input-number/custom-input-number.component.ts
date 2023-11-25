import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
@Component({
  selector: 'custom-input-number',
  templateUrl: './custom-input-number.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputNumberComponent),
      multi: true,
    },
  ],
})
export default class CustomInputNumberComponent
  implements ControlValueAccessor
{
  @Input() control: FormControl;
  @Input() placeholder: FormControl;
  @Input() readonly: boolean = false;
  @Input() horizontal: boolean = true;
  @Input() min: number = 0;
  @Input() max?: number = null;
  @Input() label: string;
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
