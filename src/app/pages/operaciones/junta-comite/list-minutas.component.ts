import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IMeetingIndex } from 'src/app/core/interfaces/meeting-index.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ReportService } from 'src/app/core/services/report.service';
import AddOrEditMeetingDetailComponent from './addoredit-meeting-detail.component';
import AddOrEditMeetingComponent from './addoredit-meeting.component';
import AddoreditMinutaDetalleComponent from './addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from './addoredit-seguimiento/addor-edit-meeting-seguimiento.component';
@Component({
  selector: 'app-list-minutas',
  templateUrl: './list-minutas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMinutasComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  customerIdService = inject(CustomerIdService);
  reportService = inject(ReportService);
  route = inject(Router);

  data: IMeetingIndex[] = [];
  tipoJunta: string = 'Comité';
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  emailAccount: boolean = false;

  ngOnInit(): void {
    this.onLoadData(this.tipoJunta);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.tipoJunta);
    });
  }
  onLoadData(tipoJunta: string) {
    const urlApi = `Meetings/GetAll/${this.customerIdService.customerId}/${this.tipoJunta}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
    this.tipoJunta = tipoJunta;
  }

  exportToExcel(meetingId: number) {
    const urlApi = `MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`; // Aquí debes proporcionar la URL de tu API
    const nombreDocumento = 'Pendientes Minuta'; // Aquí debes proporcionar el nombre de tu documento
    this.apiRequestService.exportToExcel(urlApi, nombreDocumento);
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Meetings/${id}`)
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta);
      });
  }

  onSendEmailMeeting(meetingId: number) {
    const urlApi = `SendEmail/Meeting/${meetingId}`;
    this.apiRequestService.onGetItem(urlApi).then((_) => {});
  }

  showModalAddOrEditMeeting(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditMeetingComponent,
        {
          id: data.id,
          customerId: this.customerIdService.customerId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta);
      });
  }
  items: MenuItem[];
  showModalAddOrEditMeetingDetails(id: any, header: string, status: any) {
    this.dialogHandlerService.openDialog(
      AddOrEditMeetingDetailComponent,
      {
        id,
        status,
      },
      header,
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onModalAddOrEditMinutaDetalle(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditMinutaDetalleComponent,
        {
          id: data.id,
          meetingId: data.meetingId,
          areaResponsable: data.areaResponsable,
        },
        data.header,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta);
      });
  }

  onGeneretePDF(id: number) {
    // this.reportService.setIdMinuta(id);
    this.route.navigate([
      'publico/reporte-minuta/' +
        this.customerIdService.getCustomerId() +
        '/' +
        id,
    ]);
  }
  resumenMinuta(id: number) {
    // this.reportService.setIdMinuta(id);
    this.route.navigate(['operaciones/junta-comite/resumen-minuta/' + id]);
  }
  onSendEmailResponsible(id: number, eAreaMinutasDetalles: number) {
    const urlApi = `Meetings/SendEmailResponsible/${id}/${this.customerIdService.getCustomerId()}/${eAreaMinutasDetalles}/${
      this.authService.infoUserAuthDto.applicationUserId
    }`;
    this.apiRequestService.onGetItem(urlApi).then((_) => {});
  }

  onSendEmail(id: number, eAreaMinutasDetalles: number) {
    this.onSendEmailResponsible(id, eAreaMinutasDetalles);
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.dialogHandlerService
      .openDialog(
        AddorEditMeetingSeguimientoComponent,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        'Seguimiento',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta);
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestService
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((result: boolean) => {
        this.onLoadData(this.tipoJunta);
      });
  }

  onDeleteMeetingDetail(id: number) {
    this.apiRequestService
      .onDelete(`MeetingsDetails/${id}`)
      .then((result: boolean) => {
        this.onLoadData(this.tipoJunta);
      });
  }
}
