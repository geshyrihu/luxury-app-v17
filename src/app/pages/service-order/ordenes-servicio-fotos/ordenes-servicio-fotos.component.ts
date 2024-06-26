import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ordenes-servicio-fotos',
  templateUrl: './ordenes-servicio-fotos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ImageModule],
})
export default class OrdenesServicioFotosComponent
  implements OnInit, OnDestroy
{
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService);
  ref = inject(DynamicDialogRef);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: number = 0;

  data: any[] = [];
  urlImg: string = '';
  nameCarpetaFecha = '';

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`ServiceOrders/OrdenesServicioFotos/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);

          if (this.data.length !== 0) {
            this.nameCarpetaFecha = this.data[0].nameFolder;
            this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  deleteImg(id: number): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`ServiceOrders/DeleteImg/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
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
