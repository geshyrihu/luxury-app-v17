import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-button-send-email',
  templateUrl: './custom-button-send-email.component.html',
  standalone: true,
  imports: [],
})
export default class CustomButtonSendEmailComponent {
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;
}
