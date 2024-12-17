import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { AuthService } from 'src/app/core/services/auth.service';
import BitacoraMantenimientoComponent from '../bitacora-mantenimiento/bitacora-mantenimiento.component';

@Component({
  selector: 'app-javi-bitacora',
  standalone: true,
  imports: [LuxuryAppComponentsModule, BitacoraMantenimientoComponent],
  templateUrl: './javi-bitacora.component.html',
})
export default class JaviBitacoraComponent {
  private modalService = inject(NgbModal);
  authService = inject(AuthService);

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
