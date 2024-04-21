import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import saveAs from 'file-saver';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-list-recorrido',
  templateUrl: './list-recorrido.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListRecorridoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);

  // Declaración e inicialización de variables
  data: any[] = [];
  cb_departaments = [
    { value: 3, label: 'Mantenimiento' },
    { value: 4, label: 'Limpieza' },
    { value: 6, label: 'Jardineria' },
    { value: 7, label: 'Sistemas' },
    { value: 8, label: 'Seguridad' },
  ];

  departamentId = 3;
  departamentLabel = 'MANTENIMIENTO';
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  amenitiesByLocation: { location: string; amenities: any[] }[];

  ngOnInit(): void {
    this.onLoadData(this.departamentId);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.departamentId);
    });
  }

  onSelectDepartament(departamentId: number) {
    this.departamentId = departamentId;
    this.onLoadData(departamentId);
  }
  // Función para cargar los datos de los bancos
  onLoadData(departamentId: number) {
    const urlApi = `customeramenitiescatalog/inspection/${this.customerIdService.customerId}/${departamentId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`customeramenitiescatalog/inspection/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  // TODO: generar pdf desde Api
  generatePDF() {
    const urlApi = `customeramenitiescatalog/generatepdf`;
    this.dataService.getFile(urlApi).subscribe({
      next: (resp: Blob) => {
        // Crea un objeto de tipo Blob a partir de la respuesta
        const blob = new Blob([resp], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Utiliza la función saveAs del paquete 'file-saver' para descargar el archivo
        saveAs(blob, 'Recorrido.pdf');
      },
      error: (error) => {
        console.log('🚀 ~ error:', error.error);
      },
    });
  }
}
export enum EDepartament {
  Administracion,
  Legal,
  Contabilidad,
  Mantenimiento,
  Limpieza,
  Operaciones,
  Jardineria,
  Sistemas,
  Seguridad,
  Constructora,
}
