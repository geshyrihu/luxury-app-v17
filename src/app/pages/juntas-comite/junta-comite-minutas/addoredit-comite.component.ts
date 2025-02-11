import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-addoredit-comite',
  templateUrl: './addoredit-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddOrEditComiteComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  @Input()
  customerId: number;
  @Input()
  meetingId: number;
  cb_ParticipantComite: any[] = [];
  // cb_Comite: ISelectItem[] = [];
  comiteparticipante = '';
  // participantsList: any[] = [];
  listaParticipantesComite: any[] = [];

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }
  onLoadCB() {
    const urlApi = `SelectItem/GetListComiteMinuta/${this.customerId}/${this.meetingId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_ParticipantComite = responseData;
    });
  }

  onSubmit() {
    const urlApi = `MeetingComite/AgregarParticipantesComite/${this.meetingId}/${this.comiteparticipante}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.onLoadData();
      this.onLoadCB();
    });
  }
  onDelete(idParticipant: number): void {
    this.apiRequestS
      .onDelete(`MeetingComite/${idParticipant}`)
      .then((responseData: boolean) => {
        this.onLoadData();
        this.onLoadCB();
      });
  }

  onLoadData() {
    this.comiteparticipante = '';
    const urlApi = `MeetingComite/ParticipantesComite/${this.meetingId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.listaParticipantesComite = responseData;
    });
  }
}
