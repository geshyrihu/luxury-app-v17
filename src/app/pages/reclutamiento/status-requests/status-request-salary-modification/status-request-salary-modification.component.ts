import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import CardEmployeeComponent from 'src/app/pages/directorios/employee-internal/card-employee.component';
import AddOrEditStatusRequestSalaryModificationComponent from './addoredit-status-request-salary-modification.component';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-status-request-salary-modification',
  templateUrl: './status-request-salary-modification.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class StatusRequestSalaryModificationComponent
  implements OnInit
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  router = inject(Router);
  authS = inject(AuthService);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  employeeId = this.statusSolicitudVacanteService.getemployeeId();
  ref: DynamicDialogRef;

  data: any;
  noCandidates: boolean = true;
  applicationUserId: string = this.authS.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.workPositionId === null || this.employeeId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `RequestSalaryModification/${this.workPositionId}/${this.employeeId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  //Ver tarjeta de Colaborador
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      {
        applicationUserId,
      },
      'Tarjeta de colaborador',
      this.dialogHandlerService.dialogSizeMd
    );
  }

  //Editar solicitud de baja
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditStatusRequestSalaryModificationComponent,
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
      .onDelete(`RequestSalaryModification/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
