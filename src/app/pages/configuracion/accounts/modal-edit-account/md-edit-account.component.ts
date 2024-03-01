import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
} from 'src/app/core/services/common-services';
import AccessCustomerComponent from './customer-account/access-customer.component';
import UpdateAccountComponent from './update-account/update-account.component';
import UpdatePasswordAccountComponent from './update-password/update-password-account.component';
import UpdateRoleComponent from './update-roles/update-role.component';
@Component({
  selector: 'app-md-edit-account',
  templateUrl: './md-edit-account.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    AccessCustomerComponent,
    UpdateRoleComponent,
    UpdatePasswordAccountComponent,
    UpdateAccountComponent,
  ],
})
export default class MdEditAccountComponent implements OnInit, OnDestroy {
  public apiRequestService = inject(ApiRequestService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);

  cb_emplyee: ISelectItemDto[] = [];
  data: any;
  applicationUserId: string = '';
  email: string = '';

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService.onGetList(
      'Accounts/GetApplicationUser/' + this.applicationUserId
    );
  }
  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
