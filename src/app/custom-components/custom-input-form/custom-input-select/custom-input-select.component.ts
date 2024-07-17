import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import ValidationErrorsCustomInputComponent from '../validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
  selector: 'custom-input-select',
  templateUrl: './custom-input-select.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    ValidationErrorsCustomInputComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectComponent),
      multi: true,
    },
  ],
})
export default class CustomInputSelectComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() control: FormControl;
  @Input() data: ISelectItem[];
  @Input() hidden: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() label: string;
  @Input() placeholder: string = '--Selecciona una opción--';
  @Input() SelectDefaulOption: boolean = true;

  value: any;
  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  ngOnInit(): void {
    if (this.control) {
      this.value = this.control.value;
      this.control.valueChanges.subscribe((value) => {
        this.value = value;
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.control) {
      this.value = this.control.value;
    }
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
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

  trackByFn(index: number, item: any): any {
    return item.value;
  }
}
