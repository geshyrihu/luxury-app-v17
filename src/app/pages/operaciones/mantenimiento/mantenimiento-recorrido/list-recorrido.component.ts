import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddBitacoraComponent from '../mantenimiento-bitacoras/recorridos/add-bitacora.component';
import BitacoraIndividualComponent from '../mantenimiento-bitacoras/recorridos/bitacora-individual.component';
import RecorridoTaskAddOrEditComponent from './addoredit-recorrido-task.component';
import RecorridoAddOrEditComponent from './addoreedit-recorrido.component';

@Component({
  selector: 'app-list-recorrido',
  templateUrl: './list-recorrido.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ComponentsModule,
    CommonModule,
    PrimeNgModule,
    RouterModule,
    NgbDropdownModule,
  ],
  providers: [
    ConfirmationService,
    DialogService,
    MessageService,
    CustomToastService,
  ],
})
export default class ListRecorridoComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  pathImg = environment.base_urlImg;
  data: any[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  value: number = 0;
  filterValue: string = ' ';

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData(this.value);
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.value);
    });
  }

  filterGlobal() {
    if (this.filterValue !== ' ' || this.filterValue !== null) {
      this.onLoadData(this.value);
    } else {
      this.onLoadData(this.value);
    }
  }
  onChange(value: number) {
    this.data = [];
    this.value = value;
    this.onLoadData(this.value);
  }

  onLoadData(value: number) {
    if (this.filterValue === ' ') {
      // Mostrar un mensaje de carga
      this.customToastService.onLoading();
    }

    this.dataService
      .get(
        `Routes/GetAll/${this.customerIdService.getcustomerId()}/${value}/${
          this.filterValue
        }`
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

  onDelete(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`Routes/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData(this.value);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDeleteTask(taskId: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`RouteTask/${taskId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData(this.value);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(RecorridoAddOrEditComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.value);
      }
    });
  }
  onModalAddTask(data: any) {
    this.ref = this.dialogService.open(RecorridoTaskAddOrEditComponent, {
      data: {
        id: data.id,
        routeId: data.routeId,
      },
      header: 'Agregar revisión a recorrido',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.value);
      }
    });
  }

  eliminarRecorrido(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete('Routes/' + id)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData(this.value);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onModalBitacora(machineryId: number) {
    this.ref = this.dialogService.open(AddBitacoraComponent, {
      data: {
        machineryId,
      },
      header: 'Registrar novedades',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onModalBitacoraIndividual(data: any) {
    this.ref = this.dialogService.open(BitacoraIndividualComponent, {
      data: {
        machineryId: data.machineryId,
        nameMachinery: data.nameMachinery,
      },
      header: 'Bitacora',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.value);
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
