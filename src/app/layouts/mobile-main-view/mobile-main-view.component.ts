import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subscription } from 'rxjs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { TicketGroupService } from 'src/app/pages/5.3-tickets/ticket.service';

@Component({
  selector: 'app-mobile-main-view',
  standalone: true,
  imports: [
    SimplebarAngularModule,
    LuxuryAppComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './mobile-main-view.component.html',
})
export default class MobileMainViewComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  location = inject(Location);
  router = inject(Router);
  customerIdService = inject(CustomerIdService);

  ticketGroupService = inject(TicketGroupService);
  signalRService = inject(SignalRService);

  messageInNotRead: number = 0;
  notifications: any[] = [];
  private notificationSubscription: Subscription;
  private notificationUpdateSubscription: Subscription;

  options = { autoHide: true };

  isSuperUser = this.authS.onValidateRoles(['SuperUsuario']);
  isJefe = this.authS.onValidateRoles([
    'GerenteMantenimiento',
    'JefeMantenimiento',
    'Administrador',
    'SuperUsuario',
    'SupervisionOperativa',
  ]);
  nameUser =
    this.authS.infoUserAuthDto.firstName +
    ' ' +
    this.authS.infoUserAuthDto.lastName;

  cb_customer: any[] = [];
  customerId = this.customerIdService.customerId;
  nameCustomer = this.customerIdService.nameCustomer;

  constructor() {
    this.onLoadDataCustomer(this.customerId);
    this.apiRequestService
      .onGetSelectItem(
        `CustomersAcceso/${this.authS.infoUserAuthDto.applicationUserId}`
      )
      .then((resp: any) => {
        this.cb_customer = resp;
      });
  }
  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);

    // Escuchar cambios en `nameCustomer`
    this.customerIdService.getCustomerId$().subscribe(() => {
      this.nameCustomer = this.customerIdService.nameCustomer;
    });
  }
  logout() {
    const currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigate(['/auth/login']);

    this.apiRequestService
      .onGetItem(`Auth/Logout/${this.authS.infoUserAuthDto.applicationUserId}`)
      .then(() => {});
  }
  onBack = () => this.location.back();

  onLoadDataCustomer(customerId: number) {
    const urlApi = `customers/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.nameCustomer = result.nameCustomer;
    });
  }

  ngOnInit() {
    this.onLoadNotification();

    // Suscribirse al observable de notificaciones recibidas
    this.notificationSubscription = this.signalRService
      .getNotificationObservable()
      .subscribe((notificationData) => {
        this.onLoadNotification();
      });

    // Suscribirse a las actualizaciones de lectura
    this.notificationUpdateSubscription = this.signalRService
      .getNotificationUpdateObservable()
      .subscribe(() => {
        this.onLoadNotification();
      });
  }

  onLoadNotification() {
    this.messageInNotRead = 0;
    this.notifications = [];
    const urlApi = `NotificationUser/GetAllUnread/${this.authS.applicationUserId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.notifications = result;
      this.notifications.forEach((x: any) => {
        if (!x.isRead) {
          this.messageInNotRead++;
        }
      });
    });
  }

  getTruncatedMessage(message: string, maxLength: number): string {
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.notificationUpdateSubscription) {
      this.notificationUpdateSubscription.unsubscribe();
    }
  }
}
