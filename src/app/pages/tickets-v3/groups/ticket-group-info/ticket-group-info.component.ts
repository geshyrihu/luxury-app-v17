import { Component, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-ticket-group-info',
  templateUrl: './ticket-group-info.component.html',
  standalone: true,
})
export class TicketGroupInfoComponent {
  config = inject(DynamicDialogConfig);

  description = this.config.data.description;
}
