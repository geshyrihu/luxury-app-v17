import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
  standalone: true,
  imports: [NgClass],
})

/**
 * Page Title Component
 */
export default class PagetitleComponent {
  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
  }>;

  @Input() title: string | undefined;
}
