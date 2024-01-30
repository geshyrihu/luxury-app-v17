import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [RouterModule, CommonModule, NgbTooltip],
  selector: 'custom-button-link',
  standalone: true,
  templateUrl: './custom-button-link.component.html',
})
export default class CustomButtonLinkComponent {
  @Input() customClass: string = '';
  @Input() customNgClass: any;
  @Input() customNgClassIcon: string = '';
  @Input() icon = '';
  @Input() label = '';
  @Input() ngbTooltip: string = '';
  @Input() placement: string = 'top';
  @Input() router: string = '';
  @Input() type: string = 'button';
}
