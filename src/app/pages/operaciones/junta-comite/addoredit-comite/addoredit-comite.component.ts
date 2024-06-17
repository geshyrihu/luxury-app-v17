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
  apiRequestService = inject(ApiRequestService);
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
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_ParticipantComite = result;
    });
  }

  onSubmit() {
    const urlApi = `MeetingComite/AgregarParticipantesComite/${this.meetingId}/${this.comiteparticipante}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.onLoadData();
      this.onLoadCB();
    });
  }
  onDelete(idParticipant: number): void {
    this.apiRequestService
      .onDelete(`MeetingComite/${idParticipant}`)
      .then((result: boolean) => {
        this.onLoadData();
        this.onLoadCB();
      });
  }

  onLoadData() {
    this.comiteparticipante = '';
    const urlApi = `MeetingComite/ParticipantesComite/${this.meetingId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.listaParticipantesComite = result;
    });
  }
}
