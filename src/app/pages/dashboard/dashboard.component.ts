import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import BitacoraMantenimientoComponent from 'src/app/pages/5.3-bitacoras/bitacora-mantenimiento/bitacora-mantenimiento.component';
import DashboardPreventiveMaintenanceComponent from './dashboard-preventive-maintenance/dashboard-preventive-maintenance.component';
import DashboardRequestsToLegalComponent from './dashboard-requests-to-legal/dashboard-requests-to-legal.component';
import DashboardTicketCommitteeMeetingComponent from './dashboard-ticket-committee-meeting/dashboard-ticket-committee-meeting.component';
import DashboardTicketsComponent from './dashboard-tickets/dashboard-tickets.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    BitacoraMantenimientoComponent,
    DashboardPreventiveMaintenanceComponent,
    DashboardTicketCommitteeMeetingComponent,
    DashboardTicketsComponent,
    DashboardRequestsToLegalComponent,
  ],
})
export default class DashboardComponent {}
