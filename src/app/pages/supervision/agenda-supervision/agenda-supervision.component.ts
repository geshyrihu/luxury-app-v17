import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import AddOrEditAgendaSupervisionComponent from './addoredit-agenda-supervision.component';

@Component({
  selector: 'app-agenda-supervision',
  templateUrl: './agenda-supervision.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AgendaSupervisionComponent implements OnInit {
  dateS = inject(DateService);
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  rangoCalendarioService = inject(FiltroCalendarService);

  loading: boolean = true;
  rangeDates: Date[] = [];
  ref: DynamicDialogRef;
  data: any[] = [];

  cb_user: any[] = [];
  cb_customers: any[] = [];
  cb_estatus: any[] = ['Concluido', 'Pendiente'];

  fechaInicial: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  applicationUserId = this.authS.applicationUserId;
  depto: string = 'SUPERVISIÓN DE OPERACIONES';
  nombre: string =
    this.authS.infoUserAuthDto.firstName +
    ' ' +
    this.authS.infoUserAuthDto.lastName;
  semana: string = this.fechaInicial + ' a ' + this.fechaFinal;

  ngOnInit(): void {
    this.onLoadUserSupervisor();

    this.apiRequestS.onGetSelectItem(`NombreCorto`).then((response: any) => {
      this.cb_customers = response.map((selectList: any) => ({
        label: selectList.label,
      }));
    });

    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `AgendaSupervision/GetAll/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onLoadUserSupervisor() {
    const urlApi = `getlistsupervision`;
    this.apiRequestS.onGetSelectItem(urlApi).then((result: any) => {
      this.cb_user = result;
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditAgendaSupervisionComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`AgendaSupervision/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
