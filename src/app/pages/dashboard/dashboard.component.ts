import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { AuthService } from 'src/app/core/services/auth.service';
import DashboardPreventiveMaintenanceComponent from './dashboard-preventive-maintenance.component';
import DashboardRequestsToLegalComponent from './dashboard-requests-to-legal.component';
import DashboardTicketCommitteeMeetingComponent from './dashboard-ticket-committee-meeting.component';
import DashboardTicketsComponent from './dashboard-tickets.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    DashboardPreventiveMaintenanceComponent,
    DashboardTicketCommitteeMeetingComponent,
    DashboardTicketsComponent,
    DashboardRequestsToLegalComponent,
  ],
})
export default class DashboardComponent implements OnInit {
  autS = inject(AuthService);
  router = inject(Router);

  isAutorized = this.autS.onValidateRoles([
    'Administrador',
    'SuperUsuario',
    'SupervisionOperativa',
    'JefeMantenimiento',
  ]);

  ngOnInit(): void {
    // Si no es Administrador, redirigir a /tickets/my-assignments
    if (!this.isAutorized) {
      this.router.navigate(['/tickets/my-assignments']);
    }

    // Si no es ninguno, el componente se cargará
  }
}
