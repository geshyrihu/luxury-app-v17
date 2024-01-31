import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  FiltroCalendarService,
} from 'src/app/core/services/common-services';
import DashboardMinutasResumenComponent from '../dashboard-minutas-resumen/dashboard-minutas-resumen.component';

@Component({
  selector: 'app-dashboard-minutas',
  templateUrl: './dashboard-minutas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DashboardMinutasComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  private customerIdService = inject(CustomerIdService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  constructor() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
  }

  ngOnInit(): void {
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
    this.onLoadData();
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Dashboard/MinutasPendientes/${this.customerIdService.getcustomerId()}`
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

  onModalAddOrEditMinutaDetalle(eAreaMinutasDetalles: number) {
    let titulo: string = '';

    if (eAreaMinutasDetalles == 0) {
      titulo = 'Contable';
    }
    if (eAreaMinutasDetalles == 1) {
      titulo = 'Operaciones';
    }
    if (eAreaMinutasDetalles == 2) {
      titulo = 'Legal';
    }
    this.ref = this.dialogService.open(DashboardMinutasResumenComponent, {
      data: {
        eAreaMinutasDetalles,
      },
      header: 'Pendientes ' + titulo,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      autoZIndex: true,
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
