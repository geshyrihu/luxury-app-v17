import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import { EmployeeAddOrEditService } from '../employee-add-or-edit/employee-add-or-edit.service';
@Component({
  selector: 'app-list-general-employee',
  templateUrl: './list-general-employee.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [ApiRequestService, ConfirmationService],
})
export default class ListGeneralEmployeeComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  router = inject(Router);
  data: any[] = [];
  url = environment.base_urlImg;
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `Person/All`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService.onDelete(`Person/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }
  onShowModalEditEmpleado(
    applicationUserId: string,
    employeeId: number,
    nameEmployee: string
  ) {
    this.employeeAddOrEditService.onSetId(applicationUserId);
    this.employeeAddOrEditService.onSetEmployeeId(employeeId);
    this.employeeAddOrEditService.onSetNameEmployee(nameEmployee);
    this.router.navigateByUrl('directorio/empleado');
  }
  // // Modal datos laborales
  // onModalDataLaboral(data: any) {
  //   this.ref = this.dialogService.open(PersonEditDataLaboralComponent, {
  //     data: {
  //       employeeId: data.employeeId,
  //     },
  //     header: data.title,
  //     styleClass: 'modal-lg',
  //     baseZIndex: 10000,
  //     closeOnEscape: true,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }

  // // Modal datos direccion
  // onModalDataAddress(data: any) {
  //   this.ref = this.dialogService.open(PersonAddoreditAddressComponent, {
  //     data: {
  //       personId: data.id,
  //     },
  //     header: data.title,
  //     styleClass: 'modal-lg',
  //     baseZIndex: 10000,
  //     closeOnEscape: true,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }
  // // Modal datos personales
  // onModalDataPersonal(data: any) {
  //   this.ref = this.dialogService.open(AddoreditPersonDataComponent, {
  //     data: {
  //       personId: data.id,
  //     },
  //     header: data.title,
  //     styleClass: 'modal-lg',
  //     baseZIndex: 10000,
  //     closeOnEscape: true,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }

  // // Modal datos principales
  // onModalCreatePerson(data: any) {
  //   this.ref = this.dialogService.open(AddoreditPersonComponent, {
  //     data: {
  //       personId: data.id,
  //     },
  //     header: data.title,
  //     styleClass: 'modal-lg',
  //     baseZIndex: 10000,
  //     closeOnEscape: true,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }
  // onModalDataPrincipal(data: any) {
  //   this.ref = this.dialogService.open(PersonEditDataPrincipalComponent, {
  //     data: {
  //       personId: data.id,
  //     },
  //     header: data.title,
  //     styleClass: 'modal-lg',
  //     baseZIndex: 10000,
  //     closeOnEscape: true,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }

  // // Mostar tarjeta de Persona

  // onCardEmployee(personId: number) {
  //   this.ref = this.dialogService.open(CardEmployeeComponent, {
  //     data: {
  //       personId,
  //     },
  //     header: 'Colaborador',
  //     styleClass: 'modal-sm',
  //     closeOnEscape: true,
  //     baseZIndex: 10000,
  //   });
  // }

  // // Actualkizar Imagen
  // onShowModalActualizarImagen(personId: number) {
  //   this.ref = this.dialogService.open(PersonUpdatePhotoComponent, {
  //     data: {
  //       personId,
  //     },
  //     header: 'Actualizar Foto',
  //     baseZIndex: 10000,
  //     closeOnEscape: true,
  //     styleClass: 'modal-md',
  //   });

  //   // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }
}
