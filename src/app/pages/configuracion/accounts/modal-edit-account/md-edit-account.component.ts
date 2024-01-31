import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
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
    LuxuryAppComponentsModule,
    AccessCustomerComponent,
    UpdateRoleComponent,
    UpdatePasswordAccountComponent,
    UpdateAccountComponent,
  ],
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

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
    this.onLoadData();
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('GetAllEmployeeActive')
      .subscribe((resp) => {
        this.cb_emplyee = resp;
      });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('Accounts/GetApplicationUser/' + this.applicationUserId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
