import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  StatusSolicitudVacanteService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditStatusRequestSalaryModificationComponent from './addoredit-status-request-salary-modification/addoredit-status-request-salary-modification.component';
@Component({
  selector: 'app-status-request-salary-modification',
  templateUrl: './status-request-salary-modification.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    PrimeNgModule,
    FormsModule,
    CommonModule,
    CustomButtonModule,
    PhoneFormatPipe,
    PrimeNgModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class StatusRequestSalaryModificationComponent
  implements OnInit, OnDestroy
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public router = inject(Router);
  public authService = inject(AuthService);
  public apiRequestService = inject(ApiRequestService);

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
