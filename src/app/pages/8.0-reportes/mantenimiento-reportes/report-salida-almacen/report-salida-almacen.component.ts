import { Component, OnInit, inject } from "@angular/core";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Observable, Subject, takeUntil } from "rxjs";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DataService } from "src/app/core/services/data.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodoMonthService } from "src/app/core/services/periodo-month.service";
import PagetitleReportComponent from "src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component";
@Component({
  selector: "app-report-salida-almacen",
  templateUrl: "./report-salida-almacen.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule, PagetitleReportComponent],
})
export default class ReportSalidaAlmacenComponent implements OnInit {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });

    this.periodoInicial$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `MaintenanceReport/salidaproducto/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
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
