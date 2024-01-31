import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-addoredit-list-administration',
  templateUrl: './addoredit-list-administration.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddOrEditListAdministrationComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  @Input()
  customerId: number;
  @Input()
  meetingId: number;
  cb_ParticipantAdministration: any[] = [];
  cb_Administration: any[] = [];
  participantsList: any[] = [];
  administrationparticipante = '';
  listaParticipantesAdministration: any[] = [];

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }
  onLoadCB() {
    this.dataService
      .get(
        'SelectItem/GetListAdministracionMinuta/' +
          this.customerId +
          '/' +
          this.meetingId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_Administration = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    this.dataService
      .get(
        `MeetingAdministracion/AgregarParticipantesAdministracion/${this.meetingId}/${this.administrationparticipante}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
          this.onLoadCB();
        },
        error: (err) => {
          this.customToastService.onShowError();
        },
      });
  }
  onDelete(idParticipant: number): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`MeetingAdministracion/${idParticipant}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.onLoadCB();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadData() {
    this.dataService
      .get(
        `MeetingAdministracion/ParticipantesAdministracion/${this.meetingId}`
      )
      .subscribe((resp: any) => {
        this.listaParticipantesAdministration = resp.body;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
