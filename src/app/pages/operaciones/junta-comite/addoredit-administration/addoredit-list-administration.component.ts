import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-addoredit-list-administration',
  templateUrl: './addoredit-list-administration.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditListAdministrationComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  subRef$: Subscription;

  @Input()
  customerId: number;
  @Input()
  meetingId: number;
  cb_ParticipantAdministration: any[] = [];
  cb_Administration: any[] = [];
  participantsList: any[] = [];
  administrationparticipante = '';
  listaParticipantesAdministration: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.onLoadCB();
    this.onLoadData();
  }
  onLoadCB() {
    this.subRef$ = this.dataService
      .get(
        'SelectItem/GetListAdministracionMinuta/' +
          this.customerId +
          '/' +
          this.meetingId
      )
      .subscribe({
        next: (resp: any) => {
          this.cb_Administration = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
    this.subRef$ = this.dataService
      .get(
        `MeetingAdministracion/AgregarParticipantesAdministracion/${this.meetingId}/${this.administrationparticipante}`
      )
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
    this.subRef$ = this.dataService
      .delete(`MeetingAdministracion/${idParticipant}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.onLoadCB();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(
        `MeetingAdministracion/ParticipantesAdministracion/${this.meetingId}`
      )
      .subscribe((resp: any) => {
        this.listaParticipantesAdministration = resp.body;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
