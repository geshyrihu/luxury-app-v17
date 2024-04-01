import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import AddOrEditStatusRequestSalaryModificationComponent from './addoredit-status-request-salary-modification/addoredit-status-request-salary-modification.component';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-status-request-salary-modification',
  templateUrl: './status-request-salary-modification.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class StatusRequestSalaryModificationComponent
  implements OnInit, OnDestroy
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  customToastService = inject(CustomToastService);
  public router = inject(Router);
  authService = inject(AuthService);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  employeeId = this.statusSolicitudVacanteService.getemployeeId();
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any;
  noCandidates: boolean = true;
  pahtBaseImg = environment.base_urlImg + 'Administration/accounts/';
  applicationUserId: string =
    this.authService.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.workPositionId === null || this.employeeId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `RequestSalaryModification/${this.workPositionId}/${this.employeeId}`
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

  //Ver tarjeta de Colaborador
  onCardEmployee(employeeId: any) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId: employeeId,
      },
      header: 'Tarjeta de colaborador',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  //Editar solicitud de baja
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddOrEditStatusRequestSalaryModificationComponent,
      {
        data: {
          id: data.id,
        },
        header: data.title,
        styleClass: 'modal-md',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
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

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
