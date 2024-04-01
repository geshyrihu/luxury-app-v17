import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import CardEmployeeComponent from '../../operaciones/directorios/empleados/card-employee/card-employee.component';
import AddoreditPersonDataComponent from '../addoredit-person-data/addoredit-person-data.component';
import AddoreditPersonComponent from '../addoredit-person/addoredit-person.component';
import PersonAddoreditAddressComponent from '../person-addoredit-address/person-addoredit-address.component';
import PersonEditDataLaboralComponent from '../person-edit-data-laboral/person-edit-data-laboral.component';
import PersonEditDataPrincipalComponent from '../person-edit-data-principal/person-edit-data-principal.component';
import PersonUpdatePhotoComponent from '../person-update-photo/update-image-person.component';
@Component({
  selector: 'app-list-persons',
  templateUrl: './list-persons.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [ApiRequestService, ConfirmationService],
})
export default class ListPersonComponent implements OnInit, OnDestroy {
  apiRequestService = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  data: any[] = [];
  url = environment.base_urlImg;
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`person/all/`)
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

  onDelete(id: number) {
    this.apiRequestService.onDelete(`Person/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  // Modal datos laborales
  onModalDataLaboral(data: any) {
    this.ref = this.dialogService.open(PersonEditDataLaboralComponent, {
      data: {
        employeeId: data.employeeId,
        personId: data.personId,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  // Modal datos direccion
  onModalDataAddress(data: any) {
    this.ref = this.dialogService.open(PersonAddoreditAddressComponent, {
      data: {
        personId: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  // Modal datos personales
  onModalDataPersonal(data: any) {
    this.ref = this.dialogService.open(AddoreditPersonDataComponent, {
      data: {
        personId: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  // Modal datos principales
  onModalCreatePerson(data: any) {
    this.ref = this.dialogService.open(AddoreditPersonComponent, {
      data: {
        personId: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalDataPrincipal(data: any) {
    this.ref = this.dialogService.open(PersonEditDataPrincipalComponent, {
      data: {
        personId: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  // Mostar tarjeta de Persona

  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Colaborador',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  // Actualkizar Imagen
  onShowModalActualizarImagen(personId: number) {
    this.ref = this.dialogService.open(PersonUpdatePhotoComponent, {
      data: {
        personId,
      },
      header: 'Actualizar Foto',
      baseZIndex: 10000,
      closeOnEscape: true,
      styleClass: 'modal-md',
    });

    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
