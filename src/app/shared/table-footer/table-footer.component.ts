import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  standalone: true,
})
export default class TableFooterComponent {
  @Input()
  data: any[] = [];
}
