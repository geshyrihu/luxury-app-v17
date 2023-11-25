import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';

@Component({
  selector: 'custom-input-datalist',
  templateUrl: './custom-input-datalist.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputDatalistComponent),
      multi: true,
    },
  ],
})
export default class CustomInputDatalistComponent
  implements ControlValueAccessor, OnInit
{
  @Input() control: FormControl;
  @Input() placeholder: FormControl;
  @Input() horizontal: boolean = true;
  @Input() label: string = '';
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = false;
  @Input() dataListId: string;
  @Input() data: ISelectItemDto[];
  value: any;
  onChange: any;
  onTouch: any;
  disabled: boolean;

  @Output()
  propagar = new EventEmitter<any>();
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

  public onSelectItem(e: any): void {
    this.propagar.emit(e);
  }
  // Otros métodos y lógica del componente
}
