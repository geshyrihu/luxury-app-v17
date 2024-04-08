import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
@Component({
  selector: 'app-addoredit-invited',
  templateUrl: './addoredit-invited.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddOrEditInvitedComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

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
    const urlApi = `MeetingInvitado/AgregarParticipantesInvitado/${this.meetingId}/${this.invitado}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }
  onDelete(idParticipant: number): void {
    this.apiRequestService
      .onDelete(`MeetingInvitado/${idParticipant}`)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  onLoadData() {
    const urlApi = `MeetingInvitado/ParticipantesInvitado/${this.meetingId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.listaInvitados = result;
      this.invitado = '';
    });
  }
}
