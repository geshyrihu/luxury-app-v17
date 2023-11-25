import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import saveAs from 'file-saver';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IMeetingIndexDto } from 'src/app/core/interfaces/IMeetingIndexDto.interface';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  ReportService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditMeetingDetailComponent from './addoredit-meeting-detail.component';
import AddOrEditMeetingComponent from './addoredit-meeting.component';
import AddoreditMinutaDetalleComponent from './addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from './addoredit-seguimiento/addor-edit-meeting-seguimiento.component';

@Component({
  selector: 'app-list-minutas',
  templateUrl: './list-minutas.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    RouterModule,
    CommonModule,
    PrimeNgModule,
    SanitizeHtmlPipe,
    NgbTooltip,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListMinutasComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public reportService = inject(ReportService);
  public route = inject(Router);
  public customToastService = inject(CustomToastService);

  data: IMeetingIndexDto[] = [];
  tipoJunta: string = 'Comité';
  ref: DynamicDialogRef;
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get<IMeetingIndexDto[]>(
        `Meetings/GetAll/${this.customerIdService.customerId}/${this.tipoJunta}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  exportToExcel(meetingId: number) {
    this.subRef$ = this.dataService
      .getFile(`MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`)
      .subscribe({
        next: (resp: Blob) => {
          // Crea un objeto de tipo Blob a partir de la respuesta
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Utiliza la función saveAs del paquete 'file-saver' para descargar el archivo
          saveAs(blob, 'Pendientes Minuta');
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete('Meetings/' + data.id).subscribe({
      next: () => {
        this.onLoadData(this.tipoJunta);
        this.customToastService.onCloseToSuccess();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  onSendEmailMeeting(meetingId: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IMeetingIndexDto[]>(`SendEmail/Meeting/${meetingId}`)
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
    this.subRef$ = this.dataService
      .get(
        `Meetings/SendEmailResponsible/${id}/${this.customerIdService.getcustomerId()}/${eAreaMinutasDetalles}/${
          this.authService.infoUserAuthDto.applicationUserId
        }`
      )
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
    this.subRef$ = this.dataService
      .delete(`MeetingDertailsSeguimiento/${id}`)
      .subscribe({
        next: () => {
          this.onLoadData(this.tipoJunta);
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onDeleteMeetingDetail(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`MeetingsDetails/${id}`).subscribe({
      next: () => {
        this.customToastService.onCloseToSuccess();
        this.onLoadData(this.tipoJunta);
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
