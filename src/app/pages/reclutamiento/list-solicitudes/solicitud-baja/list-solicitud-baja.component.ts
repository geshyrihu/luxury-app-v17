import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import FilterRequestsComponent from '../filter-requests.component';
import AddoreditSolicitudBajaComponent from './addoredit-solicitud-baja.component';

@Component({
    selector: 'app-list-solicitud-baja',
    templateUrl: './list-solicitud-baja.component.html',
    imports: [LuxuryAppComponentsModule, FilterRequestsComponent]
})
export default class ListSolicitudBajaComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  filterRequestsService = inject(FilterRequestsService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    const urlApi = `requestdismissal/list/`;
    const params = this.filterRequestsService.getParams();
    this.apiRequestS.onGetList(urlApi, params).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditSolicitudBajaComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`RequestDismissal/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
