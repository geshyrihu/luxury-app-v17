import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { PositionRequestAgendaDto } from 'src/app/core/interfaces/PositionRequestAgendaDto';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditVacanteCandidatoComponent from './addoredit-vacante-candidato.component';
@Component({
  selector: 'app-list-vacante-candidatos',
  templateUrl: './list-vacante-candidatos.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    NgbTooltip,
    CommonModule,
    FormsModule,
    PrimeNgModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class LisVacanteCandidatosComponent implements OnInit {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public activatedRoute = inject(ActivatedRoute);
  public dialogService = inject(DialogService);

  data: PositionRequestAgendaDto;
  positionRequestId: number =
    this.activatedRoute.snapshot.params.positionRequestId;
  customerId: number = 0;
  noCandidates: boolean = true;
  ref: DynamicDialogRef;
  subRef$: Subscription;
  pathPdf: string = `${environment.base_urlImg}Administration/reclutamiento/solicitudes/`;
  submitting: boolean = false;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<PositionRequestAgendaDto>(
        'PositionRequestAgenda/Candidatos/' + this.positionRequestId
      )
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
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`PositionRequestAgenda/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          // Mostrar un mensaje de éxito y cerrar Loading....
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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

  onSendEmailConfirm() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    let dataSend: number[] = [];
    this.data.candidates.forEach((item) => {
      if (item.sendCandidate == true) {
        dataSend.push(item.id);
      }
    });
    this.dataService
      .post(
        `SolicitudesReclutamiento/SendCandidates/${this.positionRequestId}`,
        dataSend
      )
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onValueCandidates() {
    this.noCandidates = !this.data.candidates.some(
      (item) => item.sendCandidate
    );
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
