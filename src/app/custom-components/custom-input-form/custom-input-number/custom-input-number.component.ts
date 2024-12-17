import { CommonModule } from "@angular/common";
import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import ValidationErrorsCustomInputComponent from "../validation-errors-custom-input/validation-errors-custom-input.component";

@Component({
  selector: "custom-input-number",
  templateUrl: "./custom-input-number.component.html",
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    ValidationErrorsCustomInputComponent,
  ],
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
  @Input() hidden: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() max?: number = null;
  @Input() min: number = 0;
  @Input() placeholder: string;
  @Input() readonly: boolean = false;

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
