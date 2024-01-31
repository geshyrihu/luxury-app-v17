import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  AuthService,
  CustomToastService,
} from 'src/app/core/services/common-services';
import BitacoraMantenimientoComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/recorridos/bitacora-mantenimiento.component';
import DashboardMinutasComponent from './dashboard-minutas/dashboard-minutas.component';
import DashboardTicketsComponent from './dashboard-tickets/dashboard-tickets.component';
import MantenimientosPreventivosComponent from './mttos-preventivos/mttos-preventivos.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    BitacoraMantenimientoComponent,
    MantenimientosPreventivosComponent,
    DashboardMinutasComponent,
    DashboardTicketsComponent,
  ],
})
export default class DashboardComponent {
  private modalService = inject(NgbModal);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);

  ref: DynamicDialogRef;

  /**
   * Open extra large modal
   * @param exlargeModal extra large modal data
   */
  extraLarge(exlargeModal: any) {
    this.modalService.open(exlargeModal, {
      size: 'xl',
      windowClass: 'modal-holder',
      centered: true,
      scrollable: true,
    });
  }
}
