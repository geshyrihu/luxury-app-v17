import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
})

/**
 * Page Title Component
 */
export default class PagetitleComponent {
  @Input() title: string | undefined;
}
