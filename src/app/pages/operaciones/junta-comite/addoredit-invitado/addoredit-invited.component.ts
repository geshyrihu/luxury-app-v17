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
  selector: 'app-addoredit-invited',
  templateUrl: './addoredit-invited.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditInvitedComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);

  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(
        `MeetingInvitado/AgregarParticipantesInvitado/${this.meetingId}/${this.invitado}`
      )
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
    this.subRef$ = this.dataService
      .delete(`MeetingInvitado/${idParticipant}`)
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
    this.subRef$ = this.dataService
      .get(`MeetingInvitado/ParticipantesInvitado/${this.meetingId}`)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
