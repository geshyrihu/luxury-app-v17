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
  selector: 'app-addoredit-invited',
  templateUrl: './addoredit-invited.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddOrEditInvitedComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  @Input()
  customerId: number;
  @Input()
  meetingId: number;
  participantsList: any[] = [];
  listaInvitados: any[] = [];
  invitado: string = '';

  ngOnInit(): void {
    this.onLoadData();
  }

  onSubmit() {
    this.dataService
      .get(
        `MeetingInvitado/AgregarParticipantesInvitado/${this.meetingId}/${this.invitado}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onDelete(idParticipant: number): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`MeetingInvitado/${idParticipant}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadData() {
    this.dataService
      .get(`MeetingInvitado/ParticipantesInvitado/${this.meetingId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.listaInvitados = resp.body;
          this.invitado = '';
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
