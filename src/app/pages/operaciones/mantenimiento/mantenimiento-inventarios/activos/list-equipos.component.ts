import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { EInventoryCategory } from 'src/app/enums/categoria-inventario.enum';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/addoredit-maintenance-preventive.component';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
// import { EMonthPipe } from 'src/app/pipes/month.pipe';
// import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
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
  imports: [
    ComponentsModule,
    CommonModule,
    PrimeNgModule,
    // ERecurrencePipe,
    // EMonthPipe,
    CurrencyMexicoPipe,
    SanitizeHtmlPipe,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListEquiposComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rutaActiva = inject(ActivatedRoute);
  public router = inject(Router);

  public subscriber: Subscription;
  subRef$: Subscription;

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
    console.log(
      '🚀 ~ this.rutaActiva.snapshot.params.categoria:',
      this.rutaActiva.snapshot.params.categoria
    );
    this.base_urlImg = this.urlImg(this.customerId);
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId = this.customerIdService.getcustomerId();
    this.onLoadData();
    this.subscriber = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
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
    this.subRef$ = this.dataService
      .get(
        `Machineries/GetAll/${this.customerIdService.customerId}/${this.inventoryCategoryId}/${this.state}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.OnChageTitle();
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  onSelectState(value: number): void {
    this.state = value;
    this.onLoadData();
  }
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete('Machineries/' + data.id).subscribe({
      next: () => {
        this.onLoadData();
        this.customToastService.onCloseToSuccess();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
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

  onDeleteOrder(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subscriber = this.dataService
      .delete(`MaintenanceCalendars/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
