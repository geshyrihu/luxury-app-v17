import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

const date = new Date();

@Component({
  selector: 'app-list-cedulas-presupuestales',
  templateUrl: './list-cedulas-presupuestales.component.html',
  standalone: true,
  imports: [ComponentsModule, RouterModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListCedulasPresupuestalesComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  private selectItemService = inject(SelectItemService);
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
    this.selectItemService
      .onGetSelectItem('customers')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_customer = items;
      });
    this.selectItemService
      .onGetSelectItem(`GetAllYears`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_Year = resp.body;
        },
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
