import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ticketPanelMenuItems } from './ticket-panel-menu';

@Component({
  selector: 'app-ticket-panel',
  templateUrl: './ticket-panel.component.html',
  standalone: true,
})
export default class TicketPanelComponent implements OnInit {
  private route = inject(Router);

  ticketPanelMenuItems = ticketPanelMenuItems;
  ngOnInit() {}

  onNavigate(route: string): void {
    this.route.navigateByUrl(route);
  }
}
