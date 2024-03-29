import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/addoredit-maintenance-preventive.component';

import { environment } from 'src/environments/environment';
import BitacoraIndividualComponent from '../../mantenimiento-bitacoras/recorridos/bitacora-individual.component';
import OrderServiceComponent from '../orden-service/order-service.component';
import ActivosDocumentosComponent from './activos-documentos.component';
import AddOrEditActivosComponent from './addoredit-activos.component';
import FichaTecnicaActivoComponent from './ficha-tecnica-activo/ficha-tecnica-activo.component';
import ServiceHistoryMachineryComponent from './service-history-machinery/service-history-machinery.component';

@Component({
  selector: 'app-list-equipos',
  templateUrl: './list-equipos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEquiposComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rutaActiva = inject(ActivatedRoute);
  public router = inject(Router);

  public subscriber: Subscription;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  base_urlImg = '';
  customerId: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[];
  datadetail: any[];
  paramId: string = '';
  ref: DynamicDialogRef;
  inventoryCategoryId: any;
  state: number = 0;
  subTitle: string = '';
  title: string = '';

  mostrarPreventivos: boolean = true;

  ngOnInit() {
    this.inventoryCategoryId = this.rutaActiva.snapshot.params.categoria;
    this.base_urlImg = this.urlImg(this.customerId);
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId = this.customerIdService.getcustomerId();
    this.onLoadData();
    this.subscriber = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_) => {
        this.inventoryCategoryId = this.rutaActiva.snapshot.params.categoria;

        if (this.inventoryCategoryId == 3 || this.inventoryCategoryId == 4) {
          this.mostrarPreventivos = false;
        } else {
          this.mostrarPreventivos = true;
        }
        this.onLoadData();
      });
    this.customerId$.subscribe((resp) => {
      this.customerId = this.customerIdService.getcustomerId();
      this.onLoadData();
    });
  }
  onLoadData() {
    if (this.state) this.subTitle = ' Inactivos';
    if (!this.state) this.subTitle = ' Activos';
    // this.onPath();
    this.base_urlImg = this.urlImg(this.customerId);
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Machineries/GetAll/${this.customerIdService.customerId}/${this.inventoryCategoryId}/${this.state}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.OnChageTitle();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSelectState(value: number): void {
    this.state = value;
    this.onLoadData();
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Machineries/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalFichatecnica(data: any) {
    this.ref = this.dialogService.open(FichaTecnicaActivoComponent, {
      data: {
        id: data.id,
      },
      header: 'Ficha Técnica',
      height: '100%',
      width: '100%',
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalAddoredit(data: any) {
    this.ref = this.dialogService.open(AddOrEditActivosComponent, {
      data: {
        id: data.id,
        paramId: 1,
        inventoryCategory: this.inventoryCategoryId,
      },
      header: data.title,
      styleClass: 'modal-mdInventory',
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalMaintenanceCalendar(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.task,
          idMachinery: data.machineryId,
        },
        header: data.header,
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onBitacoraIndividual(machineryId: number) {
    this.ref = this.dialogService.open(BitacoraIndividualComponent, {
      data: {
        machineryId: machineryId,
      },
      header: '',
      closeOnEscape: true,
      width: '100%',
      baseZIndex: 10000,
    });
  }

  showModalListOrderService(id: number) {
    this.ref = this.dialogService.open(OrderServiceComponent, {
      data: {
        id: id,
      },
      header: 'Servicios de Mantenimiento',
      styleClass: 'modal-mdInventory',
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  showModalAddOrEditCalendars(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.activity,
          idMachinery: data.machineryId,
        },
        header: data.title,
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onDocumentos(machineryId: number) {
    this.ref = this.dialogService.open(ActivosDocumentosComponent, {
      data: {
        machineryId: machineryId,
      },
      header: 'Documentos',
      closeOnEscape: true,
      styleClass: 'modal-mdInventory',
      baseZIndex: 10000,
    });
  }

  urlImg(customerId: any): string {
    return `${environment.base_urlImg}customers/${customerId}/machinery/`;
  }

  OnChageTitle() {
    if (this.inventoryCategoryId == 1) {
      this.title = 'Equipos Electromecanicos';
    }
    if (this.inventoryCategoryId == 2) {
      this.title = 'Amenidades';
    }
    if (this.inventoryCategoryId == 3) {
      this.title = 'Mobiliario';
    }
    if (this.inventoryCategoryId == 4) {
      this.title = 'Equipamiento';
    }
    if (this.inventoryCategoryId == 5) {
      this.title = 'Equipos de Gimnasio';
    }
    if (this.inventoryCategoryId == 6) {
      this.title = 'Equipos de Sistemas';
    }
    if (this.inventoryCategoryId == 8) {
      this.title = 'Areas Comunes';
    }
    if (this.inventoryCategoryId == 7) {
      this.title = 'Bodegas, Cuartos de Maquinas';
    }
  }

  onDeleteOrder(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subscriber = this.dataService
      .delete(`MaintenanceCalendars/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onServiceHistory(id: number) {
    this.ref = this.dialogService.open(ServiceHistoryMachineryComponent, {
      data: {
        id,
      },
      width: '100%',
      height: '100%',
      closeOnEscape: true,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
