import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import InspectionsAddoreditComponent from '../inspections-addoredit/inspections-addoredit.component';

@Component({
    selector: 'app-inspections',
    imports: [LuxuryAppComponentsModule, RouterModule],
    templateUrl: './inspections-list.component.html'
})
export default class InspectionsListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);

  customerId: number;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  areasResponsables: string[] = []; // Para almacenar las áreas responsables
  inspeccionesOriginales: any[] = []; // Inspecciones completas desde el backend
  inspeccionesFiltradas: any[] = []; // Inspecciones filtradas según el área seleccionada

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `inspection/list/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.inspeccionesOriginales = responseData;

      // Inicializar inspecciones filtradas con todos los datos
      this.inspeccionesFiltradas = [...this.inspeccionesOriginales];

      const data: any[] = responseData;
      // Extraer áreas responsables del arreglo y eliminar duplicados
      this.areasResponsables = [
        ...new Set(data.map((item) => item.areaResponsable)),
      ];
    });
  }

  selectedArea: string = ''; // Valor seleccionado para área
  selectedRecurrence: string = ''; // Valor seleccionado para recurrencia

  onFilterChange(): void {
    this.inspeccionesFiltradas = this.inspeccionesOriginales
      .map((group) => ({
        ...group,
        inspecciones: group.inspecciones.filter((inspeccion: any) => {
          const matchesArea =
            this.selectedArea === '' ||
            group.areaResponsable === this.selectedArea;
          const matchesRecurrence =
            this.selectedRecurrence === '' ||
            inspeccion.recurrencia === this.selectedRecurrence;
          return matchesArea && matchesRecurrence;
        }),
      }))
      .filter((group) => group.inspecciones.length > 0);
  }
  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspectionsAddoreditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
