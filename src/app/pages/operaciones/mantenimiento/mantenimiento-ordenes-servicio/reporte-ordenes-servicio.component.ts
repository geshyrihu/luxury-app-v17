import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reporte-ordenes-servicio',
  templateUrl: './reporte-ordenes-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteOrdenesServicioComponent
  implements OnInit, OnDestroy
{
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  data: any[] = [];

  urlImg: string = '';
  fecha: string = '';
  dataCustomer: any;
  nameCarpetaFecha: string = '';
  logoCustomer = '';
  nameCustomer = '';

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadDataCXustomer();
  }
  //TODO: Centralizar obtener ifno de customer...
  onLoadDataCXustomer() {
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe((resp: any) => {
        this.dataCustomer = resp.body;
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        'ServiceOrders/ReporteOrdenesServicio/' +
          this.customerIdService.customerId +
          '/' +
          this.dateService.getDateFormat(
            this.periodoMonthService.getPeriodoInicio
          ) +
          '-01'
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.nameCarpetaFecha = this.data[0].nameFolder;
          this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
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
