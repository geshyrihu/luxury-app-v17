import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import FichaTecnicaActivoComponent from '../../operaciones/mantenimiento/mantenimiento-inventarios/activos/ficha-tecnica-activo/ficha-tecnica-activo.component';

@Component({
  selector: 'app-mi-edificio',
  templateUrl: './mi-edificio.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, TableModule, RouterModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class MiEdificioComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  baseUrlImg = environment.base_urlImg;
  data: any;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get('MiEdificio/Caratula/' + this.customerIdService.getcustomerId())
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
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
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
