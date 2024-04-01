import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import saveAs from 'file-saver';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IMeetingIndex } from 'src/app/core/interfaces/meeting-index.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
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
export default class ListMinutasComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public reportService = inject(ReportService);
  public route = inject(Router);
  customToastService = inject(CustomToastService);

  data: IMeetingIndex[] = [];
  tipoJunta: string = 'Comité';
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  emailAccount: boolean = false;

  ngOnInit(): void {
    this.onLoadData(this.tipoJunta);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.tipoJunta);
    });
  }
  onLoadData(tipoJunta: string) {
    this.tipoJunta = tipoJunta;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IMeetingIndex[]>(
        `Meetings/GetAll/${this.customerIdService.customerId}/${this.tipoJunta}`
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

  exportToExcel(meetingId: number) {
    this.dataService
      .getFile(`MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: Blob) => {
          // Crea un objeto de tipo Blob a partir de la respuesta
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Utiliza la función saveAs del paquete 'file-saver' para descargar el archivo
          saveAs(blob, 'Pendientes Minuta');
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Meetings/${id}`)
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoJunta);
      });
  }

  onSendEmailMeeting(meetingId: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IMeetingIndex[]>(`SendEmail/Meeting/${meetingId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalAddOrEditMeeting(data: any) {
    this.ref = this.dialogService.open(AddOrEditMeetingComponent, {
      data: {
        id: data.id,
        customerId: this.customerIdService.customerId,
      },
      header: data.title,
      width: '80%',
      height: '100%',

      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe(() => {
      this.customToastService.onShowSuccess();
      this.onLoadData(this.tipoJunta);
    });
  }
  items: MenuItem[];
  showModalAddOrEditMeetingDetails(id: any, header: string, status: any) {
    this.ref = this.dialogService.open(AddOrEditMeetingDetailComponent, {
      data: {
        id,
        status,
      },
      header: `${header}`,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      autoZIndex: true,
    });
  }
  onModalAddOrEditMinutaDetalle(data: any) {
    this.ref = this.dialogService.open(AddoreditMinutaDetalleComponent, {
      data: {
        id: data.id,
        meetingId: data.meetingId,
        areaResponsable: data.areaResponsable,
      },
      header: data.header,
      styleClass: 'modal-md',
      closeOnEscape: true,
      autoZIndex: true,
    });
    this.ref.onClose.subscribe(() => {
      this.onLoadData(this.tipoJunta);
    });
  }

  onGeneretePDF(id: number) {
    // this.reportService.setIdMinuta(id);
    this.route.navigate([
      'publico/reporte-minuta/' +
        this.customerIdService.getcustomerId() +
        '/' +
        id,
    ]);
  }
  resumenMinuta(id: number) {
    // this.reportService.setIdMinuta(id);
    this.route.navigate(['operaciones/junta-comite/resumen-minuta/' + id]);
  }
  onSendEmailResponsible(id: number, eAreaMinutasDetalles: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Meetings/SendEmailResponsible/${id}/${this.customerIdService.getcustomerId()}/${eAreaMinutasDetalles}/${
          this.authService.infoUserAuthDto.applicationUserId
        }`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSendEmail(id: number, eAreaMinutasDetalles: number) {
    this.onSendEmailResponsible(id, eAreaMinutasDetalles);
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.ref = this.dialogService.open(AddorEditMeetingSeguimientoComponent, {
      data: {
        meetingDetailsId,
        idMeetingSeguimiento,
      },
      header: 'Seguimiento',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.tipoJunta);
      }
    });
  }

  onDeleteSeguimiento(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`MeetingDertailsSeguimiento/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData(this.tipoJunta);
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDeleteMeetingDetail(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`MeetingsDetails/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData(this.tipoJunta);
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
