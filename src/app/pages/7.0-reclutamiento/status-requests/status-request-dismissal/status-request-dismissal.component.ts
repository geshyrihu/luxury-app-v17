import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
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
export default class StatusRequestDismissalComponent
  implements OnInit, OnDestroy
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dialogService = inject(DialogService);
  router = inject(Router);
  customToastService = inject(CustomToastService);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('RequestDismissal/' + this.workPositionId)
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
  onCardEmployee(applicationUserId: string) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        applicationUserId,
      },
      header: 'Tarjeta de Colaborador',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  //Editar solicitud de baja
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      // AddOrEditStatusRequestDismissalComponent,
      AddoreditSolicitudBajaComponent,
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
      .onDelete(`RequestDismissal/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  //Editar solicitud de Discounts
  onModalAddOrEditDiscounts(data: any) {
    this.ref = this.dialogService.open(
      AddOrEditStatusRequestDismissalDiscountComponent,
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
  onDeleteDiscounts(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`RequestDismissalDiscount/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          // Mostrar un mensaje de éxito y cerrar Loading....
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
