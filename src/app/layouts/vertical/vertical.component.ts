import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import FooterComponent from '../footer/footer.component';
import MobileMainViewComponent from '../mobile-main-view/mobile-main-view.component';
import SidebarComponent from '../sidebar/sidebar.component';
import CustomerSelectionComponent from '../topbar/customer-selection/customer-selection.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    CustomerSelectionComponent,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    MobileMainViewComponent,
  ],
})
/**
 * Vertical Component
 */
export default class VerticalComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  location = inject(Location);
  router = inject(Router);
  customerIdService = inject(CustomerIdService);

  cb_customer: any[] = [];
  customerId = this.customerIdService.customerId;

  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);
  }

  constructor() {
    this.apiRequestService
      .onGetSelectItem(
        `CustomersAcceso/${this.authS.infoUserAuthDto.applicationUserId}`
      )
      .then((resp: any) => {
        this.cb_customer = resp;
      });
  }
  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }
  onRefresh() {
    // window.location.href = window.location.href; // Reasignar la URL actual para recargar la página

    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // @HostListener('window:resize', ['$event'])
  isCondensed = false; // Variable para controlar si la interfaz está condensada o no

  // Algunos campos para almacenar el estado y mostrarlo en la interfaz de usuario
  idleState = 'NOT_STARTED'; // Estado de inactividad
  countdown?: number = null; // Contador regresivo de inactividad
  lastPing?: Date = null; // Último ping recibido

  isMobileView: boolean = false;

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
    document.body.setAttribute('data-layout', 'vertical'); // Establecer un atributo en el body del documento
  }

  /**
   * Se ejecuta cuando se hace clic en el botón de alternar menú móvil
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable'); // Alternar la clase 'sidebar-enable' en el body

    const currentSIdebarSize = document.body.getAttribute('data-sidebar-size');
    if (window.screen.width >= 992) {
      if (currentSIdebarSize == null) {
        // Configurar el atributo 'data-sidebar-size' en 'sm' o 'lg' según el valor actual
        document.body.getAttribute('data-sidebar-size') == null ||
        document.body.getAttribute('data-sidebar-size') == 'lg'
          ? document.body.setAttribute('data-sidebar-size', 'sm')
          : document.body.setAttribute('data-sidebar-size', 'lg');
      } else if (currentSIdebarSize == 'md') {
        document.body.getAttribute('data-sidebar-size') == 'md'
          ? document.body.setAttribute('data-sidebar-size', 'sm')
          : document.body.setAttribute('data-sidebar-size', 'md');
      } else {
        document.body.getAttribute('data-sidebar-size') == 'sm'
          ? document.body.setAttribute('data-sidebar-size', 'lg')
          : document.body.setAttribute('data-sidebar-size', 'sm');
      }
    }
    this.isCondensed = !this.isCondensed; // Cambiar el estado de 'isCondensed'
  }

  /**
   * Se ejecuta cuando se hace clic en el botón de configuración en la barra superior
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled'); // Alternar la clase 'right-bar-enabled' en el body
  }

  onOcultarBarra() {
    if (window.innerWidth <= 992) {
      /** Aquí deberías proporcionar una descripción de lo que hace esta función, ya que no está claro en el código. */
      this.onSettingsButtonClicked(); // Llamar a la función onSettingsButtonClicked
      this.onToggleMobileMenu(); // Llamar a la función onToggleMobileMenu
    }
  }

  checkScreenSize() {
    if (window.innerWidth <= 768) {
      // Cambia el valor 768 según tu criterio de tamaño para dispositivos móviles
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }
}
