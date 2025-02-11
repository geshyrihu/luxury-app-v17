import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [RouterModule, CommonModule, NgbTooltip],
    selector: 'btn-link',
    templateUrl: './btn-link.component.html'
})
export default class BtnLinkComponent {
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
