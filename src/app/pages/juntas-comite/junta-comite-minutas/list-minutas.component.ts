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
import AddorEditMeetingSeguimientoComponent from './addor-edit-meeting-seguimiento.component';
import AddOrEditMeetingDetailComponent from './addoredit-meeting-detail.component';
import AddOrEditMeetingComponent from './addoredit-meeting.component';
import AddoreditMinutaDetalleComponent from './addoredit-minuta-detalle.component';

@Component({
  selector: 'app-list-minutas',
  templateUrl: './list-minutas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMinutasComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  customerIdS = inject(CustomerIdService);
  reportService = inject(ReportService);
  route = inject(Router);

  data: IMeetingIndex[] = [];
  tipoJunta: string = 'Comité';
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  emailAccount: boolean = false;

  ngOnInit(): void {
    this.onLoadData(this.tipoJunta);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.tipoJunta);
    });
  }
  onLoadData(tipoJunta: string) {
    const urlApi = `Meetings/GetAll/${this.customerIdS.customerId}/${this.tipoJunta}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
    this.tipoJunta = tipoJunta;
  }

  exportToExcel(meetingId: number) {
    const urlApi = `MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`; // Aquí debes proporcionar la URL de tu API
    const nombreDocumento = 'Pendientes Minuta'; // Aquí debes proporcionar el nombre de tu documento
    this.apiRequestS.exportToExcel(urlApi, nombreDocumento);
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`Meetings/${id}`)
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.tipoJunta);
      });
  }

  onSendEmailMeeting(meetingId: number) {
    const urlApi = `SendEmail/Meeting/${meetingId}`;
    this.apiRequestS.onGetItem(urlApi).then((_) => {});
  }

  showModalAddOrEditMeeting(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditMeetingComponent,
        {
          id: data.id,
          customerId: this.customerIdS.customerId,
        },
        data.title,
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.tipoJunta);
      });
  }
  items: MenuItem[];
  showModalAddOrEditMeetingDetails(id: any, header: string, status: any) {
    this.dialogHandlerS.openDialog(
      AddOrEditMeetingDetailComponent,
      {
        id,
        status,
      },
      header,
      this.dialogHandlerS.dialogSizeFull
    );
  }
  onModalAddOrEditMinutaDetalle(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditMinutaDetalleComponent,
        {
          id: data.id,
          meetingId: data.meetingId,
          areaResponsable: data.areaResponsable,
        },
        data.header,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.tipoJunta);
      });
  }

  onGeneretePDF(id: number) {
    // this.reportService.setIdMinuta(id);
    this.route.navigate([
      'publico/reporte-minuta/' + this.customerIdS.getCustomerId() + '/' + id,
    ]);
  }
  resumenMinuta(id: number) {
    // this.reportService.setIdMinuta(id);
    this.route.navigate(['/junta-comite/resumen-minuta/' + id]);
  }
  onSendEmailResponsible(id: number, eAreaMinutasDetalles: number) {
    const urlApi = `Meetings/SendEmailResponsible/${id}/${this.customerIdS.getCustomerId()}/${eAreaMinutasDetalles}/${
      this.authS.infoUserAuthDto.applicationUserId
    }`;
    this.apiRequestS.onGetItem(urlApi).then((_) => {});
  }

  onSendEmail(id: number, eAreaMinutasDetalles: number) {
    this.onSendEmailResponsible(id, eAreaMinutasDetalles);
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.dialogHandlerS
      .openDialog(
        AddorEditMeetingSeguimientoComponent,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        'Seguimiento',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.tipoJunta);
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestS
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((responseData: boolean) => {
        this.onLoadData(this.tipoJunta);
      });
  }

  onDeleteMeetingDetail(id: number) {
    this.apiRequestS
      .onDelete(`MeetingsDetails/${id}`)
      .then((responseData: boolean) => {
        this.onLoadData(this.tipoJunta);
      });
  }
}
