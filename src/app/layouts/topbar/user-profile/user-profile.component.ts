import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SimplebarAngularModule } from 'simplebar-angular';
import { InfoAccountAuthDto } from 'src/app/core/interfaces/user-token.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    imports: [CommonModule, RouterModule, SimplebarAngularModule, FormsModule]
})
export default class UserProfileComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  profielServiceService = inject(ProfielServiceService);
  router = inject(Router);
  customerIdS = inject(CustomerIdService);

  infoAccountAuthDto: InfoAccountAuthDto;

  profileImageUrl: string = '';

  customerName = this.authS.infoUserAuthDto.customer;
  customerPhotoPath = this.authS.infoUserAuthDto.customerPhotoPath;

  cb_customer: any[] = [];
  customerId = this.customerIdS.customerId;

  ngOnInit() {
    this.infoAccountAuthDto = this.authS.infoUserAuthDto;
    this.profileImageUrl = this.infoAccountAuthDto.photoPath;
    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.infoAccountAuthDto = nuevaImagenUrl.imagenUrl;
      }
    );
    this.cb_customer = this.authS.customerAccess;
  }

  /**
   * Logout the user
   */
  logout() {
    const currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigate(['/auth/login']);

    this.apiRequestS.onGetItem(
      `Auth/Logout/${this.authS.infoUserAuthDto.applicationUserId}`
    );
  }

  selectCustomer(customerId: number) {
    this.customerIdS.setCustomerId(customerId);
  }
}
