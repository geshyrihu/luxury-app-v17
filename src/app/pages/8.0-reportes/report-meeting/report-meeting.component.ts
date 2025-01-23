import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-meeting',
  templateUrl: './report-meeting.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReportMeetingComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  rutaActiva = inject(ActivatedRoute);
  custIdService = inject(CustomerIdService);

  formattedDate: Date | null = null;

  data: any = [];
  detalles: any = [];

  customerId: number = 0;
  meetingId: number = 0;
  logoCustomer = '';
  nameCustomer = '';
  imgBase = environment.base_urlImg + 'Administration/customer/';

  ngOnInit(): void {
    this.data = [];

    // Capturar los parámetros de la ruta
    this.rutaActiva.params.subscribe((params) => {
      this.customerId = +params['customer']; // Convierte a número
      this.meetingId = +params['id']; // Convierte a número

      // Llamadas a los métodos
      this.loadMeetingData();
      this.onLoadCustomer();
    });
  }

  loadMeetingData() {
    const urlApi = `Meetings/MeetingReportPdf/${this.meetingId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.detalles = result.asuntos;
    });
  }

  onLoadCustomer() {
    const urlApi = `Customers/${this.customerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = `${this.imgBase}${result.photoPath}`;
    });
  }
}
