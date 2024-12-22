import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import InspectionsAddoreditComponent from './inspections-addoredit/inspections-addoredit.component';

@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './inspections-list.component.html',
})
export default class InspectionsListComponent {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  data: any = [
    {
      id: '1',
      areaResponsable: 'Mantenimiento Amenidades',
      recurrencia: 'Mensual',
      editarInspeccion: true,
      eliminarInspeccion: true,
    },
    {
      id: '2',
      areaResponsable: 'Mantenimiento equipos',
      recurrencia: 'Trimestral',
      editarInspeccion: true,
      eliminarInspeccion: true,
    },
    {
      id: '3',
      areaResponsable: 'Limpieza',
      recurrencia: 'Mensual',
      editarInspeccion: true,
      eliminarInspeccion: true,
    },
    {
      id: '4',
      areaResponsable: 'Área 4',
      recurrencia: 'Diaria',
      editarInspeccion: true,
      eliminarInspeccion: true,
    },
    {
      id: '5',
      areaResponsable: 'Área 5',
      recurrencia: 'Mensual',
      editarInspeccion: true,
      eliminarInspeccion: true,
    },
  ];

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService.openDialog(
      InspectionsAddoreditComponent,
      data,
      data.title,
      this.dialogHandlerService.dialogSizeMd
    );
  }
}
