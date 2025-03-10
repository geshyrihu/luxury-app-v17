import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import Swal from 'sweetalert2';
import AddPresentacionJuntaComiteComponent from './add-presentacion-junta-comite.component';
import AddoreditPresentacionJuntaComiteComponent from './addoredit-presentacion-junta-comite.component';

@Component({
    selector: 'app-presentacion-junta-comite',
    templateUrl: './presentacion-junta-comite.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class PresentacionJuntaComiteComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);

  ref: DynamicDialogRef;
  applicationUserId: string =
    this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  data: PresentacionJuntaComiteDto[] = [];
  supervisorContable: boolean = false;

  ngOnInit(): void {
    this.onLoadData();

    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onValidarId(userId: string): boolean {
    return userId === this.authS.applicationUserId;
  }

  onLoadData(): void {
    const urlApi = `PresentacionJuntaComite/GetAll/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditPresentacionJuntaComiteComponent,
        {
          id: data.id,
          titulo: data.titulo,
        },
        data.titulo,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  showModalAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddPresentacionJuntaComiteComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  // Eliminar pdf
  onDelete(item: any, area: string) {
    const urlApi = `PresentacionJuntaComite/${item.id}/${area}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: boolean) => {
      if (responseData) this.onLoadData();
    });
  }
  // Eliminar registro completo
  onDeleteItem(item: any) {
    const urlApi = `PresentacionJuntaComite/${item.id}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: boolean) => {
      if (responseData) this.onLoadData();
    });
  }

  onValidarPresentacion(id: number) {
    const urlApi = `PresentacionJuntaComite/AutorizarPresentacion/${id}/${this.authS.applicationUserId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: boolean) => {
      if (responseData) {
        this.enviarMailPresentacionComite(id);
        this.onLoadData();
      }
    });
  }

  onValidateContabilidad(
    id: number,
    employeeSupervisorContableId: number
  ): void {
    const confirmacion =
      employeeSupervisorContableId == null
        ? 'Confirmo que la parte contable es correcta!!'
        : 'Se va a revocar la revisión';

    Swal.fire({
      title: 'Estas Seguro?',
      text: confirmacion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#50C878',
      cancelButtonColor: '#9B1B30',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((responseData) => {
      if (responseData.value) {
        let urlApi = ``;
        if (employeeSupervisorContableId == null) {
          urlApi =
            'PresentacionJuntaComite/AutorizarContable/' +
            id +
            '/' +
            this.authS.applicationUserId;
        } else {
          urlApi = 'PresentacionJuntaComite/RevocarContable/' + id;
        }
        this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
          this.onLoadData();
        });
      }
    });
  }

  onValidarCargasCompletasPorArea(
    portada: string,
    contabilidad: string,
    operaciones: string
  ): boolean {
    return portada !== '' && contabilidad !== '' && operaciones !== '';
  }

  enviarMailPresentacionComite(idJunta: number) {
    const urlApi = `SendEmail/PresentacionFinalComite/${idJunta}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.onLoadData();
    });
  }
}
export interface PresentacionJuntaComiteDto {
  id: number;
  fechaCorrespondienteFiltro: string;
  fechaCorrespondiente: string;
  fechaJunta: string;
  fechaJuntaFiltro: string;
  archivoPortada: string;
  applicationUserPortada: string;
  fechaCargaPortada: string;
  archivoContable: string;
  applicationUserContable: string;
  fechaCargaContable: string;
  archivoJunta: string;
  applicationUser: string;
  fechaCarga: string;
  archivoFinal: string;
  applicationUserSupervisor: string;
  fechaCargaSupervisor: string;
  enviadoComite: boolean;
}
