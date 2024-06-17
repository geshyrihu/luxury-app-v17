import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ITicketPanelMenu } from 'src/app/core/interfaces/ticket-panel.menu.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuTikecket } from './ticket-panel-menu';

@Component({
  selector: 'app-ticket-panel',
  templateUrl: './ticket-panel.component.html',
  imports: [RouterLink],
  standalone: true,
})
export default class TicketPanelComponent {
  authService = inject(AuthService);

  ticketPanelMenuItems: ITicketPanelMenu[] = MenuTikecket;
}
