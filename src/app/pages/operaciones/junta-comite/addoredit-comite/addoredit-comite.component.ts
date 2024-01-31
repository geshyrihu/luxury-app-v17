import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-addoredit-comite',
  templateUrl: './addoredit-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddOrEditComiteComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  @Input()
  customerId: number;
  @Input()
  meetingId: number;
  cb_ParticipantComite: any[] = [];
  cb_Comite: ISelectItemDto[] = [];
  comiteparticipante = '';
  participantsList: any[] = [];
  listaParticipantesComite: any[] = [];

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }
  onLoadCB() {
    this.dataService
      .get(
        'SelectItem/GetListComiteMinuta/' +
          this.customerId +
          '/' +
          this.meetingId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_ParticipantComite = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    this.dataService
      .get(
        `MeetingComite/AgregarParticipantesComite/${this.meetingId}/${this.comiteparticipante}`
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
      .delete(`MeetingComite/${idParticipant}`)
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
    this.comiteparticipante = '';

    this.dataService
      .get(`MeetingComite/ParticipantesComite/${this.meetingId}`)
      .subscribe((resp: any) => {
        this.listaParticipantesComite = resp.body;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
