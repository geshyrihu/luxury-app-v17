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
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  value: number = 0;
  filterValue: string = ' ';

  ngOnInit(): void {
    this.customerId$ = this.customerIdS.getCustomerId$();
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
    const urlApi = `Routes/GetAll/${this.customerIdS.getCustomerId()}/${value}/${
      this.filterValue
    }`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onDelete(id: number) {
    this.apiRequestS.onDelete(`Routes/${id}`).then((responseData: boolean) => {
      if (responseData) {
        this.data = this.data.filter((item) => item.id !== id);
        this.onLoadData(this.value);
      }
    });
  }

  onDeleteTask(taskId: number) {
    const urlApi = `RouteTask/${taskId}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: boolean) => {
      this.onLoadData(this.value);
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        RecorridoAddOrEditComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.value);
      });
  }
  onModalAddTask(data: any) {
    this.dialogHandlerS
      .openDialog(
        RecorridoTaskAddOrEditComponent,
        {
          id: data.id,
          routeId: data.routeId,
        },
        'Agregar revisión a recorrido',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.value);
      });
  }

  eliminarRecorrido(id: number) {
    const urlApi = `Routes/${id}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: boolean) => {
      this.onLoadData(this.value);
    });
  }
  onModalBitacora(machineryId: number) {
    this.dialogHandlerS.openDialog(
      BitacoraAddComponent,
      {
        machineryId,
      },
      'Registrar novedades',
      this.dialogHandlerS.dialogSizeMd
    );
  }
  onModalBitacoraIndividual(data: any) {
    this.dialogHandlerS
      .openDialog(
        BitacoraIndividualComponent,
        {
          machineryId: data.machineryId,
          nameMachinery: data.nameMachinery,
        },
        'Bitacora',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.value);
      });
  }
}
