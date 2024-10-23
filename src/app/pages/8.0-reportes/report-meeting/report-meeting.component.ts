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
  selector: 'app-report-meeting',
  templateUrl: './report-meeting.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReportMeetingComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public rutaActiva = inject(ActivatedRoute);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  formattedDate: Date | null = null;

  data: any = [];
  detalles: any = [];

  customer: number = 0;
  meetingId: number = 0;
  logoCustomer = '';
  nameCustomer = '';
  imgBase = environment.base_urlImg + 'Administration/customer/';
  ngOnInit(): void {
    this.data = [];
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.customer = this.rutaActiva.snapshot.params.customer;
    this.meetingId = this.rutaActiva.snapshot.params.id;

    this.dataService
      .get(`Meetings/MeetingReportPdf/${this.meetingId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.detalles = resp.body.asuntos;
          this.onLoadCustomer();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadCustomer() {
    this.dataService
      .get(`Customers/${this.customer}`)
      .subscribe((resp: any) => {
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
