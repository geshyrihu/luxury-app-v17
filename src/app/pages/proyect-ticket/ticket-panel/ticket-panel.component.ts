import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-ticket-panel',
  templateUrl: './ticket-panel.component.html',
  standalone: true,
})
export default class TicketPanelComponent implements OnInit {
  private route = inject(Router);
  private authService = inject(AuthService);

  ticketPanelMenuItems: TicketPanelMenu[] = [
    // {
    //   routerLink: '/ticket-panel/tickets',
    //   title: 'Limpieza',
    //   icon: 'fa-duotone fa-broom-wide',
    // },
    {
      routerLink: this.onValidateProfession(),
      // routerLink: '/legal/list-ticket-legal',
      // routerLink: '/legal/list-ticket-customer',
      title: 'Legal',
      icon: 'fa-duotone fa-gavel',
    },
    // {
    //   routerLink: '/legal/list-ticket-legal',
    //   routerLink: '/legal/list-ticket-legal',
    //   title: 'Jardineria',
    //   icon: 'fa-brands fa-pagelines',
    // },
  ];
  ngOnInit() {}

  // VALIDAR SI ES DE PROFESSION LEGAL O NO

  onValidateProfession(): string {
    console.log(
      '🚀 ~ this.authService.userTokenDto.infoEmployeeDto.profession:',
      this.authService.onValidateRoles(['Legal'])
    );
    if (this.authService.onValidateRoles(['Legal'])) {
      return '/legal/list-ticket-legal';
    } else {
      return '/legal/list-ticket-customer';
    }
  }

  onNavigate(route: string): void {
    this.route.navigateByUrl(route);
  }
}
export interface TicketPanelMenu {
  routerLink: string;
  title: string;
  icon: string;
}
