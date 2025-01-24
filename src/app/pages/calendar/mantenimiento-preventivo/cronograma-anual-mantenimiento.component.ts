import { Component, EventEmitter, inject, Output } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import * as FileSaver from 'file-saver';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CronogramaMantenimientoService } from 'src/app/core/services/cronograma-mantenimiento.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import MaintenancePreventiveAddoreditComponent from './maintenance-preventive-addoredit.component';

@Component({
  selector: 'app-cronograma-anual-mantenimiento',
  templateUrl: './cronograma-anual-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CronogramaAnualMantenimientoComponent {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);
  cronogramaMantenimientoService = inject(CronogramaMantenimientoService);

  customerId$: Observable<number> = this.custIdService.getCustomerId$();
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
    { icon: 'fa-hammer', id: 11, nombre: 'Carpinteria' },
  ];

  meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Definir el @Output
  @Output() messageEvent = new EventEmitter<string>();

  clickButton(event: any) {
    this.filtroEquiposValue = event.nombre;

    if (event.nombre === 'pintura') {
      this.messageEvent.emit('Pintura');
    } else {
      this.messageEvent.emit('preventivo de equipos');
    }
    this.filtroId = event.id;
    this.onLoadData();
  }
  ngOnInit() {
    this.itemsInventario = this.cronogramaMantenimientoService.data;
    this.customerId$ = this.custIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const endpoint =
      this.filtroId === 10
        ? `MaintenanceCalendars/CronogramaAnual/${this.custIdService.customerId}`
        : `MaintenanceCalendars/CronogramaAnual/${this.custIdService.customerId}/${this.filtroId}`;

    this.apiRequestService.onGetItem(endpoint).then((result: any) => {
      this.cronogramaAnual = result;
    });
  }

  exportExcel() {
    let dataCalendar = [];
    this.apiRequestService
      .onGetItem(
        `MaintenanceCalendars/ExportCalendar/${this.custIdService.customerId}`
      )
      .then((result: any) => {
        dataCalendar = result;
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
    this.dialogHandlerService
      .openDialog(
        MaintenancePreventiveAddoreditComponent,
        {
          idnombre: id,
          id: id,
          task: 'edit',
          header: 'Editar regitro ' + id,
        },
        'Editar regitro',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
