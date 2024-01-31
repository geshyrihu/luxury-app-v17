import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import AddOrEditCalendarioMaestroComponent from './addoredit-calendario-maestro.component';
import ModalDatosServicioComponent from './modal-datos-servicio/modal-datos-servicio.component';

@Component({
  selector: 'app-calendario-maestro',
  templateUrl: './calendario-maestro.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CalendarioMaestroComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public authService = inject(AuthService);
  public apiRequestService = inject(ApiRequestService);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get('CalendarioMaestro/GetAll')
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

  onDatosServicio(data: any) {
    this.ref = this.dialogService.open(ModalDatosServicioComponent, {
      data: {
        servicio: data.descripcionServicio,
        observaciones: data.observaciones,
        proveedores: data.proveedores,
      },
      header: 'Información de servicio',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
  onDelete(id: number): any {
    this.apiRequestService
      .onDelete(`calendariomaestro/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(id: number, mes: number) {
    this.ref = this.dialogService.open(AddOrEditCalendarioMaestroComponent, {
      data: {
        id,
        mes,
      },
      header: 'Calendario Maestro',
      height: '100%',
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
