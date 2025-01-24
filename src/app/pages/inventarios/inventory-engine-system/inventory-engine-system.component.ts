import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import BitacoraIndividualComponent from '../../bitacoras/recorrido-mantenimiento/bitacora-individual.component';
import AddOrEditActivosComponent from '../machineries/addoredit-activos.component';
import FichaTecnicaActivoComponent from '../machineries/ficha-tecnica-activo.component';
import ServiceHistoryMachineryComponent from '../machineries/service-history-machinery.component';

@Component({
  selector: 'app-inventory-engine-system',
  templateUrl: './inventory-engine-system.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class InventoryEngineSystemComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);

  // Declaración e inicialización de variables
  data: any[] = [];
  filteredData: any[] = [];

  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `InventoryEngineSystem/List/${this.custIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.filteredData = result;
    });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerService
      .openDialog(
        FichaTecnicaActivoComponent,
        data,
        'Ficha Técnica',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onBitacoraIndividual(machineryId: number) {
    this.dialogHandlerService.openDialog(
      BitacoraIndividualComponent,
      {
        machineryId: machineryId,
      },
      '',
      this.dialogHandlerService.dialogSizeFull
    );
  }
  onServiceHistory(id: number) {
    this.dialogHandlerService.openDialog(
      ServiceHistoryMachineryComponent,
      {
        id: id,
      },
      '',
      this.dialogHandlerService.dialogSizeFull
    );
  }
  // showModalListOrderService(id: number) {
  //   this.dialogHandlerService
  //     .openDialog(
  //       ServiceOrderComponent,
  //       {
  //         id: id,
  //       },
  //       'Servicios de Mantenimiento',
  //       this.dialogHandlerService.dialogSizeFull
  //     )
  //     .then((result: any) => {
  //       if (result) this.onLoadData();
  //     });
  // }

  showModalAddoredit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditActivosComponent,
        {
          id: data.id,
          paramId: 1,
          inventoryCategory: data.inventoryCategoryId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: any) => {
        if (result) this.onLoadData();
      });
  }

  // Método para filtrar los datos por sistema
  onFilterForSystem(system: string) {
    if (system === '') {
      // Si el valor es vacío, mostrar todos
      this.showAll();
    } else {
      // Filtra los datos basados en el sistema seleccionado
      this.filteredData = this.data.filter((item) => item.system === system);
    }
  }

  showAll() {
    // Restaura los datos originales
    this.filteredData = [...this.data];
  }
}
