import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditEmplopyeeComponent from '../../operaciones/directorios/empleados/addoredit-data-employee/addoredit-employee.component';
import CardEmployeeComponent from '../../operaciones/directorios/empleados/card-employee/card-employee.component';
import AddoreditPersonDataComponent from '../addoredit-person-data/addoredit-person-data.component';
import AddoreditPersonComponent from '../addoredit-person/addoredit-person.component';
import PersonUpdatePhotoComponent from '../person-update-photo/update-image-person.component';
@Component({
  selector: 'app-list-persons',
  templateUrl: './list-persons.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule, NgbTooltip],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListPersonComponent implements OnInit, OnDestroy {
  // Injección de dependencias
  public dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  data: any[] = [];
  url = environment.base_urlImg;
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.get(`person/all/`).subscribe({
      next: (resp: any) => {
        this.data = resp.body;
        console.log('🚀 ~ resp.body:', resp.body);
        this.customToastService.onClose();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`Person/${data.id}`).subscribe({
      next: () => {
        this.customToastService.onCloseToSuccess();
        // this.onLoadData();
        // Elimina el elemento del arreglo de datos local
        this.data = this.data.filter((item) => item.id !== data.id);
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  // Modal datos laborales
  onModalDataLaboral(data: any) {
    this.ref = this.dialogService.open(AddOrEditEmplopyeeComponent, {
      data: {
        id: data.id,
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
        id: data.id,
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

  onModalDataPrincipal(data: any) {
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
    console.log('🚀 ~ personId:', personId);
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
