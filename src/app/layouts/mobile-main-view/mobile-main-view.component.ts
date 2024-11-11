import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-mobile-main-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mobile-main-view.component.html',
})
export default class MobileMainViewComponent {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  location = inject(Location);
  router = inject(Router);
  customerIdService = inject(CustomerIdService);

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
}
