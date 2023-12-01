import { Directive, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

@Directive({
  selector: '[appControlValueAccessor]',
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit
{
  control: FormControl | undefined; // Variable para almacenar el control del formulario
  isRequired = false; // Bandera para indicar si el campo es requerido

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
