import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import MenuSelectCustomerComponent from '../menu-select-customer/menu-select-customer.component';
import SidebarComponent from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    MenuSelectCustomerComponent,
    NgxSpinnerModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
  ],
})
/**
 * Vertical Component
 */
export default class VerticalComponent implements OnInit, OnDestroy {
  private location = inject(Location);

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
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
  ngOnDestroy(): void {
    // Detener el temporizador de inactividad al destruir el componente
    // this.bnIdle.stopTimer();
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
