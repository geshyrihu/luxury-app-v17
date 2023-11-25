import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import ServiceOrderAddOrEditComponent from '../../../mantenimiento-ordenes-servicio/addoredit-service-order.component';

@Component({
  selector: 'app-service-history-machinery',
  templateUrl: './service-history-machinery.component.html',
  standalone: true,
  imports: [PrimeNgModule, ComponentsModule],
  providers: [CustomToastService],
})
export default class ServiceHistoryMachineryComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);

  private customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  id: number = this.config.data.id;
  subRef$: Subscription;
  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`Machineries/ServiceHistory/${this.config.data.id}`)
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

  onEdit(data: any) {
    this.ref = this.dialogService.open(ServiceOrderAddOrEditComponent, {
      data: {
        id: data.id,
        machineryId: data.machineryId,
        providerId: data.providerId,
      },
      header: data.title,
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
