import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import DescripcionPuestoComponent from '../../../catalog/professions/descripcion-puesto.component';
import HoursWorkPositionComponent from '../../plantilla/hours-work-position.component';
import FilterRequestsComponent from '../filter-requests.component';
import AddOrEditVacanteComponent from './addoredit-vacante.component';
import RegisterEmployeToVacancyComponent from './register-employe-to-vacancy/register-employe-to-vacancy.component';

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
export default class ListVacantesComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  filterRequestsService = inject(FilterRequestsService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  customToastService = inject(CustomToastService);
  router = inject(Router);
  dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    // this.onModalRegisterEmployeToVacancy({
    //   workPositionId: 1,
    //   title: 'Vacante ',
    // });
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    const urlApi = `RequestPosition/`;
    this.apiRequestService
      .onGetList(urlApi, this.filterRequestsService.getParams())
      .then((result: any) => {
        this.data = result;
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`RequestPosition/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteComponent, {
      data: {
        id: data.id,
      },
      header: 'Editar registro',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //Modal para visualizar horarios de la vacante
  onModalHoursWorkPosition(workPositionId: number) {
    this.ref = this.dialogService.open(HoursWorkPositionComponent, {
      data: {
        workPositionId,
      },
      header: 'Horario de trabajo',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Modal para visualizar descripcion de puesto
  onModalJobDescription(id: number) {
    this.ref = this.dialogService.open(DescripcionPuestoComponent, {
      data: {
        id,
      },
      header: 'Descripción del puesto',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onRouteEstatusSolicitud(id) {
    this.statusSolicitudVacanteService.setPositionRequestId(id);
    this.router.navigate(['/reclutamiento/status-solicitud-vacante']);
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  onModalRegisterEmployeToVacancy(data: any) {
    this.dialogHandlerService
      .openDialog(
        RegisterEmployeToVacancyComponent,
        {
          workPositionId: data.workPositionId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
