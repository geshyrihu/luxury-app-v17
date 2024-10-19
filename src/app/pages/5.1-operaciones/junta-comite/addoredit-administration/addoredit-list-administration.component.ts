import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
@Component({
  selector: 'app-addoredit-list-administration',
  templateUrl: './addoredit-list-administration.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddOrEditListAdministrationComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

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
    const urlApi = `SelectItem/GetListAdministracionMinuta/${this.customerId}/${this.meetingId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_Administration = result;
    });
  }

  onSubmit() {
    const urlApi = `MeetingAdministracion/AgregarParticipantesAdministracion/${
      this.meetingId
    }/${this.administrationparticipante}/${1}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.onLoadData();
      this.onLoadCB();
    });
  }
  onDelete(idParticipant: number): void {
    this.apiRequestService
      .onDelete(`MeetingAdministracion/${idParticipant}`)
      .then((result: boolean) => {
        this.onLoadData();
        this.onLoadCB();
      });
  }

  onLoadData() {
    const urlApi = `MeetingAdministracion/ParticipantesAdministracion/${this.meetingId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.listaParticipantesAdministration = result;
    });
  }
}
