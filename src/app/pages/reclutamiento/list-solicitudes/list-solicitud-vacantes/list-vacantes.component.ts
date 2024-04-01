import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import HoursWorkPositionComponent from '../../plantilla/hours-work-position.component';
import DescripcionPuestoComponent from '../../professions/descripcion-puesto.component';
import FilterRequestsComponent from '../filter-requests.component';
import AddOrEditVacanteComponent from './addoredit-vacante.component';

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
  private filterRequestsService = inject(FilterRequestsService);
  authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  customToastService = inject(CustomToastService);
  public router = inject(Router);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    this.dataService
      .get(`RequestPosition/`, this.filterRequestsService.getParams())
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
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
}
