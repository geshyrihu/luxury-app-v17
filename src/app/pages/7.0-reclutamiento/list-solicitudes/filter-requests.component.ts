import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import saveAs from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { FilterRequestsService } from 'src/app/core/services/filter-requests.service';
import CBtnModule from 'src/app/custom-components/custom-buttons/btn.module';

@Component({
  selector: 'app-filter-requests',
  templateUrl: './filter-requests.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CBtnModule],
})
export default class FilterRequestsComponent {
  apiRequestService = inject(ApiRequestService);
  dataService = inject(DataConnectorService);
  router = inject(Router);
  filterRequestsService = inject(FilterRequestsService);
  customToastService = inject(CustomToastService);

  menu = [
    { label: 'Vacantes', path: 'vacantes' },
    { label: 'Altas', path: 'altas' },
    { label: 'Bajas', path: 'bajas' },
    { label: 'Modificación de salario', path: 'aumento-sueldo' },
  ];

  fechaInicial = new Date(new Date().getFullYear(), 0, 1);
  fechaFormateada = this.fechaInicial.toISOString().slice(0, 7);
  statusRequestValue: string = 'Pendiente';

  @Input() noCandidates: number = 0;
  cb_status_request: ISelectItem[] = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Proceso', label: 'Proceso' },
    { value: 'Concluido', label: 'Concluido' },
    { value: 'Cancelado', label: 'Cancelada' },
  ];

  @Input() apiUrl: string;
  @Input() nameFile: string;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  exportToExcel(): void {
    this.dataService
      .getFile(this.apiUrl, this.filterRequestsService.getParams())
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: Blob) => {
          // Crea un objeto de tipo Blob a partir de la respuesta
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Utiliza la función saveAs del paquete 'file-saver' para descargar el archivo
          saveAs(blob, this.nameFile);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSendReportVacants() {
    const urlApi = `solicitudesreclutamiento/sendreportvacants`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.filterRequestsService.setParams(
      this.fechaFormateada,
      this.statusRequestValue
    );
  }
  // Utiliza el método `url` del Router para obtener la ruta actual.
  currentPath = this.router.url;

  isActive(path: string): boolean {
    // Utiliza el método `url` del Router para obtener la ruta actual.
    const currentPath = this.router.url;
    // Verifica si la ruta actual coincide con el enlace del botón.
    return currentPath.includes('/reclutamiento/solicitudes/' + path);
  }
}
