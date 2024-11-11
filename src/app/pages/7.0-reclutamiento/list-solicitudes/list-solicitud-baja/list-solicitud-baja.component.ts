import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import FilterRequestsComponent from '../filter-requests.component';
import AddoreditSolicitudBajaComponent from './addoredit-solicitud-baja/addoredit-solicitud-baja.component';
@Component({
  selector: 'app-list-solicitud-baja',
  templateUrl: './list-solicitud-baja.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FilterRequestsComponent],
})
export default class ListSolicitudBajaComponent implements OnInit {
  customToastService = inject(CustomToastService);
  authS = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  private filterRequestsService = inject(FilterRequestsService);

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
      .get(`requestdismissal/list/`, this.filterRequestsService.getParams())
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
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditSolicitudBajaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md modal-backdrop',
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
      .onDelete(`RequestDismissal/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
