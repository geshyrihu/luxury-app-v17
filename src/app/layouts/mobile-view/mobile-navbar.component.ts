import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { InfoAccountAuthDto } from 'src/app/core/interfaces/user-token.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { TicketGroupService } from 'src/app/pages/tickets/ticket.service';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [
    SimplebarAngularModule,
    RouterModule,
    CommonModule,
    SimplebarAngularModule,
  ],
  templateUrl: './mobile-navbar.component.html',
})
export default class MobileNavbarComponent implements OnInit, OnDestroy {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  router = inject(Router);
  customerIdS = inject(CustomerIdService);
  profielServiceService = inject(ProfielServiceService);

  location = inject(Location);
  ticketGroupService = inject(TicketGroupService);

  infoAccountAuthDto: InfoAccountAuthDto;

  profileImageUrl: string = '';

  // Propiedades del componente
  customerId: number = 0;
  nameCustomer: string = '';
  photoPath: string = '';
  cb_customer: any[] = [];
  private subscriptions: Subscription[] = [];

  // Notificaciones
  notifications: any[] = [];
  messageInNotRead: number = 0;

  isJefe = this.authS.onValidateRoles([
    'GerenteMantenimiento',
    'JefeMantenimiento',
    'Administrador',
    'SuperUsuario',
    'SupervisionOperativa',
  ]);

  ngOnInit(): void {
    this.infoAccountAuthDto = this.authS.infoUserAuthDto;
    this.profileImageUrl = this.infoAccountAuthDto.photoPath;
    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.infoAccountAuthDto = nuevaImagenUrl.imagenUrl;
      }
    );
    // Cargar de listado de clientes a los que se tiene acceso
    this.onLoadCustomerAccess();
    // Suscribirse a cambios en customerId
    const customerSubscription = this.customerIdS
      .getCustomerId$()
      .subscribe(() => {
        this.updateCustomerData();
      });

    // Añadir suscripción al array
    this.subscriptions.push(customerSubscription);

    // Cargar datos iniciales del cliente si ya están disponibles
    this.updateCustomerData();

    // Cargar notificaciones
    this.onLoadNotification();
  }

  /**
   * Actualiza las propiedades del componente con los datos actuales del servicio.
   */
  private updateCustomerData(): void {
    this.customerId = this.customerIdS.customerId;
    this.nameCustomer = this.customerIdS.nameCustomer;
    this.photoPath = this.customerIdS.photoPath;
  }

  /**
   * Cambia el cliente seleccionado y actualiza los datos del servicio.
   * @param customerId ID del cliente seleccionado
   */
  selectCustomer(customerId: number): void {
    this.customerIdS.setCustomerId(customerId);
  }
  onLoadCustomerAccess() {
    this.cb_customer = this.authS.customerAccess;
  }
  /**
   * Carga las notificaciones no leídas.
   */
  onLoadNotification(): void {
    this.messageInNotRead = 0;
    this.notifications = [];
    const urlApi = `NotificationUser/GetAllUnread/${this.authS.applicationUserId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.notifications = result;
      this.messageInNotRead = this.notifications.filter(
        (x: any) => !x.isRead
      ).length;
    });
  }

  onBack = () => this.location.back();
  logout() {
    const currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigate(['/auth/login']);

    const urlApi = `Auth/Logout/${this.authS.infoUserAuthDto.applicationUserId}`;
    this.apiRequestS.onGetItem(urlApi).then(() => {});
  }
  /**
   * Maneja la limpieza de suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
