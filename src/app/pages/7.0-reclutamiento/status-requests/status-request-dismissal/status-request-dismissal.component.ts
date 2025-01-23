import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import CardEmployeeComponent from 'src/app/pages/6.1-directorios/employee/card-employee/card-employee.component';
import { environment } from 'src/environments/environment';
import AddoreditSolicitudBajaComponent from '../../list-solicitudes/list-solicitud-baja/addoredit-solicitud-baja/addoredit-solicitud-baja.component';
import AddOrEditStatusRequestDismissalDiscountComponent from './addoredit-status-request-dismissal-discount/addoredit-status-request-dismissal-discount.component';

@Component({
  selector: 'app-status-request-dismissal',
  templateUrl: './status-request-dismissal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class StatusRequestDismissalComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);
  router = inject(Router);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  ref: DynamicDialogRef;

  data: any;
  noCandidates: boolean = true;
  pahtBaseImg = environment.base_urlImg + 'Administration/accounts/';
  applicationUserId: string = this.authS.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.workPositionId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = 'RequestDismissal/' + this.workPositionId;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  //Ver tarjeta de Colaborador
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService
      .openDialog(
        CardEmployeeComponent,
        {
          applicationUserId,
        },
        'Tarjeta de Colaborador',
        this.dialogHandlerService.dialogSizeSm
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  //Editar solicitud de baja
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditSolicitudBajaComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`RequestDismissal/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  //Editar solicitud de Discounts
  onModalAddOrEditDiscounts(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditStatusRequestDismissalDiscountComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  onDeleteDiscounts(id: number) {
    const urlApi = `RequestDismissalDiscount/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData();
    });
  }
}
