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
  apiRequestS = inject(ApiRequestService);
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
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_Administration = responseData;
    });
  }

  onSubmit() {
    const urlApi = `MeetingAdministracion/AgregarParticipantesAdministracion/${
      this.meetingId
    }/${this.administrationparticipante}/${1}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.onLoadData();
      this.onLoadCB();
    });
  }
  onDelete(idParticipant: number): void {
    this.apiRequestS
      .onDelete(`MeetingAdministracion/${idParticipant}`)
      .then((responseData: boolean) => {
        this.onLoadData();
        this.onLoadCB();
      });
  }

  onLoadData() {
    const urlApi = `MeetingAdministracion/ParticipantesAdministracion/${this.meetingId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.listaParticipantesAdministration = responseData;
    });
  }
}
