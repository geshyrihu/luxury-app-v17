import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import FilterRequestsComponent from '../filter-requests.component';
import AddOrEditSolicitudAltaComponent from './addoredit-solicitud-alta/addoredit-solicitud-alta.component';
@Component({
  selector: 'app-list-solicitud-alta',
  templateUrl: './list-solicitud-alta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FilterRequestsComponent],
})
export default class ListSolicitudAltaComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  private filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  customToastService = inject(CustomToastService);

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
      .get(
        `RequestEmployeeRegister/GetList/`,
        this.filterRequestsService.getParams()
      )
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

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditSolicitudAltaComponent, {
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`RequestEmployeeRegister/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
