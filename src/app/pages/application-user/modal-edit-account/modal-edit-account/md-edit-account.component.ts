import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import AccessCustomerComponent from '../customer-account/access-customer.component';
import UpdatePasswordAccountComponent from '../update-password/update-password-account.component';
import UpdateRoleComponent from '../update-role.component';

@Component({
  selector: 'app-md-edit-account',
  templateUrl: './md-edit-account.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    AccessCustomerComponent,
    UpdateRoleComponent,
    UpdatePasswordAccountComponent,
    // UpdateAccountComponent,
  ],
})
export default class MdEditAccountComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);

  cb_emplyee: ISelectItem[] = [];
  data: any;
  applicationUserId: string = '';
  email: string = '';

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
  }
}
