import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { CronogramaMantenimientoService } from 'src/app/core/services/cronograma-mantenimiento.service';
import AddoreditMaintenancePreventiveComponent from './addoredit-maintenance-preventive.component';

@Component({
  selector: 'app-cronograma-anual-mantenimiento',
  templateUrl: './cronograma-anual-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CronogramaAnualMantenimientoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public cronogramaMantenimientoService = inject(
    CronogramaMantenimientoService
  );

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  cronogramaAnual: any = [];
  itemsInventario: any = [];
  ref: DynamicDialogRef;

  filtroEquiposValue: any = 'equipos';
  filtroId: string | number = '';
  filtroEquipos = [
    { icon: 'fa-list-alt', id: '', nombre: 'todos' },
    { icon: 'fa-swimmer', id: 2, nombre: 'amenidades' },
    { icon: 'fa-hotel', id: 8, nombre: 'A. Comunes' },
    { icon: 'fa-door-open', id: 7, nombre: 'bodegas' },
    { icon: 'fa-cogs', id: 1, nombre: 'equipos' },
    { icon: 'fa-dumbbell', id: 5, nombre: 'gimnasio' },
    { icon: 'fa-video', id: 6, nombre: 'sistemas' },
    { icon: 'fa-paint-roller', id: 9, nombre: 'pintura' },
  ];

  meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  clickButton(event: any) {
    this.filtroEquiposValue = event.nombre;
    this.filtroId = event.id;
    this.onLoadData();
  }
  ngOnInit() {
    this.itemsInventario = this.cronogramaMantenimientoService.data;
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData(filtro?: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.filtroId == 10) {
      this.dataService
        .get(
          `MaintenanceCalendars/CronogramaAnual/${this.customerIdService.customerId}`
        )
        .subscribe({
          next: (resp: any) => {
            this.cronogramaAnual = resp.body;
            if (!this.cronogramaAnual) {
              this.customToastService.onClose();
            }
          },
          error: (error) => {
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .get(
          `MaintenanceCalendars/CronogramaAnual/${this.customerIdService.customerId}/${this.filtroId}`
        )
        .subscribe({
          next: (resp: any) => {
            this.cronogramaAnual = resp.body;
            if (!this.cronogramaAnual) {
              this.customToastService.onClose();
            }
          },
          error: (error) => {
            this.customToastService.onCloseToError(error);
          },
        });
    }
    this.customToastService.onClose();
  }

  exportExcel() {
    let dataCalendar = [];
    this.dataService
      .get(
        `MaintenanceCalendars/ExportCalendar/${this.customerIdService.customerId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          dataCalendar = resp.body;
          import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(dataCalendar);
            const workbook = {
              Sheets: { data: worksheet },
              SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'Calendario de Mantenimiento');
          });
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  onModalItem(id: number) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          idnombre: id,
          id: id,
          task: 'edit',
          header: 'Editar regitro ' + id,
        },
        header: 'Editar regitro',
        styleClass: 'modal-lg ',
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
