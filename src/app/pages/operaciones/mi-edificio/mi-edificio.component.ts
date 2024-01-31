import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';
import FichaTecnicaActivoComponent from '../../operaciones/mantenimiento/mantenimiento-inventarios/activos/ficha-tecnica-activo/ficha-tecnica-activo.component';

@Component({
  selector: 'app-mi-edificio',
  templateUrl: './mi-edificio.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    LuxuryAppComponentsModule,
    TableModule,
    RouterModule,
  ],
})
export default class MiEdificioComponent implements OnInit, OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  baseUrlImg = environment.base_urlImg;
  data: any;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  markers: any;
  zoom: number = 15;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('MiEdificio/Caratula/' + this.customerIdService.getcustomerId())
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

  // Función para agrupar elementos por la propiedad "categoria"
  groupByCategory() {
    const groupedData = {};
    this.data.equipoElectromecanicos.forEach((item) => {
      if (!groupedData[item.categoria]) {
        groupedData[item.categoria] = [];
      }
      groupedData[item.categoria].push(item);
    });
    return groupedData;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
