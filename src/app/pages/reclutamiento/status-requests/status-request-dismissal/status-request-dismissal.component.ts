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
import CardEmployeeComponent from 'src/app/pages/directorios/employee-internal/card-employee.component';
import AddoreditSolicitudBajaComponent from '../../list-solicitudes/solicitud-baja/addoredit-solicitud-baja.component';
import AddOrEditStatusRequestDismissalDiscountComponent from './addoredit-status-request-dismissal-discount.component';

@Component({
  selector: 'app-status-request-dismissal',
  templateUrl: './status-request-dismissal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class StatusRequestDismissalComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  ref: DynamicDialogRef;

  data: any;
  noCandidates: boolean = true;
  applicationUserId: string = this.authS.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.workPositionId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = 'RequestDismissal/' + this.workPositionId;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  //Ver tarjeta de Colaborador
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS
      .openDialog(
        CardEmployeeComponent,
        {
          applicationUserId,
        },
        'Tarjeta de Colaborador',
        this.dialogHandlerS.dialogSizeSm
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  //Editar solicitud de baja
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditSolicitudBajaComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`RequestDismissal/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  //Editar solicitud de Discounts
  onModalAddOrEditDiscounts(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditStatusRequestDismissalDiscountComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  onDeleteDiscounts(id: number) {
    const urlApi = `RequestDismissalDiscount/${id}`;
    this.apiRequestS.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData();
    });
  }
}
