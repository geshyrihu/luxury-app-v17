import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reporte-completo-activos',
  templateUrl: './reporte-completo-activos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteCompletoActivosComponent
  implements OnInit, OnDestroy
{
  customToastService = inject(CustomToastService);
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService); // private reporteActivosPdfService: ReporteActivosPdfService

  base_urlImg = '';
  data: any[] = [];
  titulo: string = '';
  customerId: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId = this.customerIdService.getCustomerId();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.customerId = this.customerIdService.getCustomerId();
      this.onLoadData();
    });
  }

  onLoadData() {
    this.base_urlImg = this.urlImg(this.customerId);
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get('Machineries/InventarioCompleto/' + this.customerId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    this.customToastService.onClose();
  }

  urlImg(customerId: any): string {
    return `${environment.base_urlImg}customers/${customerId}/machinery/`;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
