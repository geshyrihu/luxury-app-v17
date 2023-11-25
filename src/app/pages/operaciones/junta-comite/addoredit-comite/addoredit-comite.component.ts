import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-addoredit-comite',
  templateUrl: './addoredit-comite.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditComiteComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);

  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(
        'SelectItem/GetListComiteMinuta/' +
          this.customerId +
          '/' +
          this.meetingId
      )
      .subscribe({
        next: (resp: any) => {
          this.cb_ParticipantComite = resp.body;
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
        `MeetingComite/AgregarParticipantesComite/${this.meetingId}/${this.comiteparticipante}`
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
      .delete(`MeetingComite/${idParticipant}`)
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
    this.comiteparticipante = '';

    this.subRef$ = this.dataService
      .get(`MeetingComite/ParticipantesComite/${this.meetingId}`)
      .subscribe((resp: any) => {
        this.listaParticipantesComite = resp.body;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
