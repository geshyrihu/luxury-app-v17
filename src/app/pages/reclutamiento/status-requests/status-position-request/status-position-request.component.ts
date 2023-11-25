import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  StatusSolicitudVacanteService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditVacanteComponent from '../../list-solicitudes/list-solicitud-vacantes/addoredit-vacante.component';
import AddOrEditVacanteCandidatoComponent from '../../list-solicitudes/list-solicitud-vacantes/list-vacante-candidatos/addoredit-vacante-candidato.component';
import SolicitudAltaComponent from '../../solicitudes/solicitud-alta/solicitud-alta.component';

@Component({
  selector: 's-status-position-request',
  templateUrl: './status-position-request.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    PrimeNgModule,
    FormsModule,
    CommonModule,
    CustomInputModule,
    NgbAlertModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class statuspositionrequestcomponent
  implements OnInit, OnDestroy
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public router = inject(Router);
  public authService = inject(AuthService);

  positionRequestId = this.statusSolicitudVacanteService.getPositionRequestId();
  ref: DynamicDialogRef;
  subRef$: Subscription;
  data: any;
  noCandidates: boolean = true;
  submitting: boolean = false;
  pathPdf: string = `${environment.base_urlImg}Administration/reclutamiento/solicitudes/`;
  applicationUserId: string =
    this.authService.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.positionRequestId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('RequestPositionCandidate/Candidatos/' + this.positionRequestId)
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onValueCandidates() {
    this.noCandidates = !this.data.candidates.some(
      (item: any) => item.sendCandidate
    );
  }

  onModalSolicitudALta(requestPositionCandidateId: number) {
    this.ref = this.dialogService.open(SolicitudAltaComponent, {
      data: {
        requestPositionCandidateId: requestPositionCandidateId,
      },
      header: 'Solicitud de alta',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onModalAddOrEditPositionRequest(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onDeletePositionRequest(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`RequestPosition/${id}`).subscribe({
      next: () => {
        // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
        this.onLoadData();
        this.customToastService.onClose();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }
  onSendCandidatesForEmail() {
    let dataSend: number[] = [];
    this.data.candidates.forEach((item) => {
      if (item.sendCandidate == true) {
        dataSend.push(item.id);
      }
    });
    // Deshabilitar el botón al iniciar el envío del formulario
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.submitting = true;
    this.dataService
      .post(
        `SolicitudesReclutamiento/SendCandidates/${this.positionRequestId}`,
        dataSend
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          // Mostrar un mensaje de éxito y cerrar Loading....
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          console.log(err.error);
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteCandidatoComponent, {
      data: {
        id: data.id,
        positionRequestId: this.positionRequestId,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
