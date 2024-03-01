import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

const date = new Date();

@Component({
  selector: 'app-list-cedulas-presupuestales',
  templateUrl: './list-cedulas-presupuestales.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListCedulasPresupuestalesComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);

  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_customer: any[] = [];
  applicationUserId: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  ref: DynamicDialogRef;
  data: any[] = [];
  year: number = date.getFullYear();
  cb_Year: any[] = [];

  onLoadSelectItem() {
    console.log('🚀 ~ onLoadSelectItem:');
    this.apiRequestService
      .onGetSelectItem('customers')
      .then((response: ISelectItemDto[]) => {
        this.cb_customer = response;
      });
    this.apiRequestService
      .onGetSelectItem(`GetAllYears`)
      .then((response: ISelectItemDto[]) => {
        this.cb_Year = response;
      });
  }
  ngOnInit(): void {
    this.onLoadSelectItem();
    this.onLoadData();
  }
  onChangeYear() {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`CedulaPresupuestal/GetAllAsync/`)
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`cedulapresupuestal/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
