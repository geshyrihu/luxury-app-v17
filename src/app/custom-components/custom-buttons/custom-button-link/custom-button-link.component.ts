import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-button-link',
  templateUrl: './custom-button-link.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbTooltip],
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
