import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
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
    CommonModule,
    RouterModule,
    AccessCustomerComponent,
    UpdateRoleComponent,
    UpdatePasswordAccountComponent,
    UpdateAccountComponent,
  ],
  providers: [MessageService, CustomToastService],
})
export default class MdEditAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private selectItemService = inject(SelectItemService);

  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);

  cb_emplyee: ISelectItemDto[] = [];
  data: any;
  applicationUserId: string = '';
  email: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
    this.onLoadData();
  }

  onLoadSelectItem() {
    this.subRef$ = this.selectItemService
      .onGetSelectItem('GetAllEmployeeActive')
      .subscribe((resp) => {
        this.cb_emplyee = resp;
      });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('Accounts/GetApplicationUser/' + this.applicationUserId)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
