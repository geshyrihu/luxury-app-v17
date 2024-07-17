import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import FilterRequestsComponent from '../filter-requests.component';
import AddoreditModificacionSalarioComponent from './addoredit-modificacion-salario/addoredit-modificacion-salario.component';

@Component({
  selector: 'app-list-solicitud-modificacion-salario',
  templateUrl: './list-solicitud-modificacion-salario.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FilterRequestsComponent],
})
export default class ListSolicitudModificacionSalarioComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  filterRequestsService = inject(FilterRequestsService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);

  data: any[] = [];
  ref: DynamicDialogRef;

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }
  onLoadData() {
    const urlApi = `RequestSalaryModification`;
    this.apiRequestService
      .onGetList(urlApi, this.filterRequestsService.getParams())
      .then((result: any) => {
        this.data = result;
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`RequestSalaryModification/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditModificacionSalarioComponent,
        {
          id: data.id,
        },
        'Editar registro',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
