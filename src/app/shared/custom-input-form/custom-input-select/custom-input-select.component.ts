import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
@Component({
  selector: 'custom-input-select',
  templateUrl: './custom-input-select.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectComponent),
      multi: true,
    },
  ],
})
export default class CustomInputSelectComponent
  implements ControlValueAccessor
{
  @Input() control: FormControl;
  @Input() label: string;
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() data: ISelectItemDto[];
  @Input() horizontal: boolean = true;
  @Input() hidden: boolean = false;
  @Input() SelectDefaulOption: boolean = true;
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
