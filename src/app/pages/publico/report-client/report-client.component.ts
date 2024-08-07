import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-report-client',
  templateUrl: './report-client.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReportClientComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  rutaActiva = inject(ActivatedRoute);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any = [];
  imgBase = environment.base_urlImg + 'Administration/customer/';
  urlImgBase = environment.base_urlImg;
  customer: string = '';
  inicio: string = '';
  final: string = '';
  rutaFinal: string = '';

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;
    this.rutaFinal =
      'Tickets/GetReportClient/' +
      this.customer +
      '/' +
      this.inicio +
      '/' +
      this.final;
    this.urlImgBase = `${environment.base_urlImg}customers/${this.customer}/report/`;

    this.dataService
      .get(this.rutaFinal)
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
