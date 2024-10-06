import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-send-email',
  templateUrl: './btn-send-email.component.html',
  standalone: true,
})
export default class BtnSendEmailComponent {
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;
}
