import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import DescripcionPuestoComponent from 'src/app/pages/settings/catalogos/professions/descripcion-puesto.component';
import HoursWorkPositionComponent from '../../plantilla/hours-work-position.component';
import FilterRequestsComponent from '../filter-requests.component';
import AddOrEditVacanteComponent from './addoredit-vacante.component';
import RegisterEmployeToVacancyComponent from './register-employe-to-vacancy.component';

@Component({
  selector: 'app-list-vacantes',
  templateUrl: './list-vacantes.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    FilterRequestsComponent,
    NgbDropdownModule,
  ],
})
export default class ListVacantesComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);

  router = inject(Router);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    const urlApi = `RequestPosition/`;
    this.apiRequestS
      .onGetList(urlApi, this.filterRequestsService.getParams())
      .then((result: any) => {
        this.data = result;
      });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`RequestPosition/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditVacanteComponent,
        {
          id: data.id,
        },
        'Editar registro',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  //Modal para visualizar horarios de la vacante
  onModalHoursWorkPosition(workPositionId: number) {
    this.dialogHandlerS
      .openDialog(
        HoursWorkPositionComponent,
        {
          workPositionId,
        },
        'Horario de trabajo',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Modal para visualizar descripcion de puesto
  onModalJobDescription(id: number) {
    this.dialogHandlerS
      .openDialog(
        DescripcionPuestoComponent,
        {
          id,
        },
        'Descripción del puesto',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onRouteEstatusSolicitud(id) {
    this.statusSolicitudVacanteService.setPositionRequestId(id);
    this.router.navigate(['/reclutamiento/status-solicitud-vacante']);
  }

  onModalRegisterEmployeToVacancy(data: any) {
    this.dialogHandlerS
      .openDialog(
        RegisterEmployeToVacancyComponent,
        {
          workPositionId: data.workPositionId,
        },
        data.title,
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
