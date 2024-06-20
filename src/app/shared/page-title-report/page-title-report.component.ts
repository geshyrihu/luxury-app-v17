import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-title-report',
  templateUrl: './page-title-report.component.html',
})

/**
 * Page Title Component
 */
export default class PagetitleComponent {
  @Input() title: string | undefined;
}
