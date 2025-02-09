import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import BitacoraAddComponent from '../recorrido-mantenimiento/bitacora-add.component';
import BitacoraIndividualComponent from '../recorrido-mantenimiento/bitacora-individual.component';
import RecorridoTaskAddOrEditComponent from './addoredit-recorrido-task.component';
import RecorridoAddOrEditComponent from './addoreedit-recorrido.component';

@Component({
  selector: 'app-list-recorrido',
  templateUrl: './list-recorrido.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListRecorridoComponent implements OnInit {
  authS = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  custIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  value: number = 0;
  filterValue: string = ' ';

  ngOnInit(): void {
    this.customerId$ = this.custIdService.getCustomerId$();
    this.onLoadData(this.value);
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.value);
    });
  }

  filterGlobal() {
    if (this.filterValue !== ' ' || this.filterValue !== null) {
      this.onLoadData(this.value);
    } else {
      this.onLoadData(this.value);
    }
  }
  onChange(value: number) {
    this.data = [];
    this.value = value;
    this.onLoadData(this.value);
  }

  onLoadData(value: number) {
    const urlApi = `Routes/GetAll/${this.custIdService.getCustomerId()}/${value}/${
      this.filterValue
    }`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService.onDelete(`Routes/${id}`).then((result: boolean) => {
      if (result) {
        this.data = this.data.filter((item) => item.id !== id);
        this.onLoadData(this.value);
      }
    });
  }

  onDeleteTask(taskId: number) {
    const urlApi = `RouteTask/${taskId}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData(this.value);
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        RecorridoAddOrEditComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.value);
      });
  }
  onModalAddTask(data: any) {
    this.dialogHandlerService
      .openDialog(
        RecorridoTaskAddOrEditComponent,
        {
          id: data.id,
          routeId: data.routeId,
        },
        'Agregar revisión a recorrido',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.value);
      });
  }

  eliminarRecorrido(id: number) {
    const urlApi = `Routes/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData(this.value);
    });
  }
  onModalBitacora(machineryId: number) {
    this.dialogHandlerService.openDialog(
      BitacoraAddComponent,
      {
        machineryId,
      },
      'Registrar novedades',
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onModalBitacoraIndividual(data: any) {
    this.dialogHandlerService
      .openDialog(
        BitacoraIndividualComponent,
        {
          machineryId: data.machineryId,
          nameMachinery: data.nameMachinery,
        },
        'Bitacora',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.value);
      });
  }
}
