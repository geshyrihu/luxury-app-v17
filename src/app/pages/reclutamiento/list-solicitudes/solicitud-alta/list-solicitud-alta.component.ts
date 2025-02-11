import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import FilterRequestsComponent from '../filter-requests.component';
import AddOrEditSolicitudAltaComponent from './addoredit-solicitud-alta.component';

@Component({
    selector: 'app-list-solicitud-alta',
    templateUrl: './list-solicitud-alta.component.html',
    imports: [LuxuryAppComponentsModule, FilterRequestsComponent]
})
export default class ListSolicitudAltaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  private filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);

  data: any[] = [];
  ref: DynamicDialogRef;

  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        `RequestEmployeeRegister/GetList/`,
        this.filterRequestsService.getParams()
      )
      .then((responseData: any) => {
        this.data = responseData;
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditSolicitudAltaComponent,
        {
          id: data.id,
        },
        'Editar registro',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`RequestEmployeeRegister/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
