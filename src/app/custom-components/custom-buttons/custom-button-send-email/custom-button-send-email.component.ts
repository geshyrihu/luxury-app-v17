import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-button-send-email',
  standalone: true,
  templateUrl: './custom-button-send-email.component.html',
})
export default class CustomButtonSendEmailComponent {
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;
}
