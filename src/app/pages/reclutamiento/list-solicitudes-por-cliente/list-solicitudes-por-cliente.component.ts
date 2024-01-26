import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  StatusSolicitudVacanteService,
} from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditSolicitudAltaComponent from '../list-solicitudes/list-solicitud-alta/addoredit-solicitud-alta/addoredit-solicitud-alta.component';
import AddoreditSolicitudBajaComponent from '../list-solicitudes/list-solicitud-baja/addoredit-solicitud-baja/addoredit-solicitud-baja.component';
import AddoreditModificacionSalarioComponent from '../list-solicitudes/list-solicitud-modificación-sueldo/addoredit-modificacion-salario/addoredit-modificacion-salario.component';
import AddOrEditVacanteComponent from '../list-solicitudes/list-solicitud-vacantes/addoredit-vacante.component';

@Component({
  selector: 'app-list-solicitudes-por-cliente',
  templateUrl: './list-solicitudes-por-cliente.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule, CommonModule, RouterModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListSolicitudesPorClienteComponent implements OnInit {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public router = inject(Router);
  public authService = inject(AuthService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  // Si es administrador vamos a evitar que traiga todas las solicitudes que sean de administrador y asisntente

  // Función para cargar los datos de los bancos
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .get(
        'SolicitudesReclutamiento/solicitudesporcliente/' +
          this.customerIdService.getcustomerId() +
          '/' +
          this.authService.infoEmployeeDto.employeeId
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

  onRouteEstatusSolicitud(id) {
    this.statusSolicitudVacanteService.setPositionRequestId(id);
    this.router.navigate(['/reclutamiento/status-solicitud-vacante']);
  }
  onModalEditVacante(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteComponent, {
      data: {
        id: data.id,
      },
      header: 'Editar Registro',
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }

  onModalEditSolicitudAlta(data: any) {
    this.ref = this.dialogService.open(AddOrEditSolicitudAltaComponent, {
      data: {
        id: data.id,
      },
      header: 'Editar Registro',
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }

  onModalEditSolicitudBaja(data: any) {
    this.ref = this.dialogService.open(AddoreditSolicitudBajaComponent, {
      data: {
        id: data.id,
      },
      header: 'Editar Registro',
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }

  onModalEditModificacionSalario(data: any) {
    this.ref = this.dialogService.open(AddoreditModificacionSalarioComponent, {
      data: {
        id: data.id,
      },
      header: 'Editar Registro',
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
