import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';
@Component({
  selector: 'custom-input-text',
  templateUrl: './custom-input-text.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ValidationErrorsCustomInputComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputTextComponent),
      multi: true,
    },
  ],
})
export default class CustomInputTextComponent
  implements ControlValueAccessor, OnInit
{
  @Input() control: FormControl;
  // Mostrar el compontente
  @Input() hidden: boolean = true;
  // Modo de visualizacion de formcontrol
  @Input() horizontal: boolean = true;
  //Nombre de la etiqueta
  @Input() label: string = '';
  // Placeholder del input
  @Input() placeholder: string = '';
  @Input() customClass: string = '';
  @Input() customFormlabel: string = '';

  @Input() readonly: boolean = false;

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
