import { NgModule } from '@angular/core';
import CustomInputCheckComponent from './custom-input-check/custom-input-check.component';
import CustomInputDatalistComponent from './custom-input-datalist/custom-input-datalist.component';
import CustomInputDateTimeComponent from './custom-input-date-time/custom-input-date-time.component';
import CustomInputDateComponent from './custom-input-date/custom-input-date.component';
import CustomInputHourComponent from './custom-input-hour/custom-input-hour.component';
import CustomInputImgComponent from './custom-input-img/custom-input-img.component';
import CustomInputMaskComponent from './custom-input-mask/custom-input-mask.component';
import CustomInputMonthComponent from './custom-input-month/custom-input-month.component';
import CustomInputNumberComponent from './custom-input-number/custom-input-number.component';
import CustomInputPasswordComponent from './custom-input-password/custom-input-password.component';
import CustomInputSelectPrefixComponent from './custom-input-select prefix/custom-input-select-prefix.component';
import CustomInputSelectComponent from './custom-input-select/custom-input-select.component';
import CustomInputTextComponent from './custom-input-text/custom-input-text.component';
import CustomInputTextAreaComponent from './custom-input-textarea/custom-input-textarea.component';
import CustomInputTimeComponent from './custom-input-time/custom-input-time.component';

@NgModule({
  imports: [
    CustomInputCheckComponent,
    CustomInputDateComponent,
    CustomInputImgComponent,
    CustomInputMaskComponent,
    CustomInputNumberComponent,
    CustomInputPasswordComponent,
    CustomInputSelectComponent,
    CustomInputTextComponent,
    CustomInputTimeComponent,
    CustomInputTextAreaComponent,
    CustomInputDatalistComponent,
    CustomInputMonthComponent,
    CustomInputDateTimeComponent,
    CustomInputSelectPrefixComponent,
    CustomInputHourComponent,
  ],
  exports: [
    CustomInputCheckComponent,
    CustomInputDateComponent,
    CustomInputImgComponent,
    CustomInputMaskComponent,
    CustomInputNumberComponent,
    CustomInputPasswordComponent,
    CustomInputSelectComponent,
    CustomInputTextComponent,
    CustomInputTimeComponent,
    CustomInputTextAreaComponent,
    CustomInputDatalistComponent,
    CustomInputMonthComponent,
    CustomInputDateTimeComponent,
    CustomInputSelectPrefixComponent,
    CustomInputHourComponent,
  ],
})
export default class CustomInputModule {}
