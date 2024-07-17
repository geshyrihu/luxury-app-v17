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
import AddPresentacionJuntaComiteComponent from './add-presentacion-junta-comite/add-presentacion-junta-comite.component';
import AddoreditPresentacionJuntaComiteComponent from './addoredit-presentacion-junta-comite/addoredit-presentacion-junta-comite.component';

@Component({
  selector: 'app-presentacion-junta-comite',
  templateUrl: './presentacion-junta-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresentacionJuntaComiteComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  customerIdService = inject(CustomerIdService);
  dateService = inject(DateService);

  ref: DynamicDialogRef;

  applicationUserId: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: PresentacionJuntaComiteDto[] = [];
  supervisorContable: boolean = false;
  url: string = '';

  ngOnInit(): void {
    this.onLoadData();
    this.url = `customers/${this.customerIdService.getCustomerId()}/presentacion/`;

    this.customerId$.subscribe(() => {
      this.onLoadData();
      this.url = `customers/${this.customerIdService.getCustomerId()}/presentacion/`;
    });
  }

  onValidarId(userId: string): boolean {
    return userId === this.authService.applicationUserId;
  }

  onLoadData(): void {
    const urlApi = `PresentacionJuntaComite/GetAll/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditPresentacionJuntaComiteComponent,
        {
          id: data.id,
          titulo: data.titulo,
        },
        data.titulo,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  showModalAdd(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddPresentacionJuntaComiteComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // Eliminar pdf
  onDelete(item: any, area: string) {
    const urlApi = `PresentacionJuntaComite/${item.id}/${area}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      if (result) this.onLoadData();
    });
  }
  // Eliminar registro completo
  onDeleteItem(item: any) {
    const urlApi = `PresentacionJuntaComite/${item.id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      if (result) this.onLoadData();
    });
  }

  onValidarPresentacion(id: number) {
    const urlApi = `PresentacionJuntaComite/AutorizarPresentacion/${id}/${this.authService.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
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
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        let urlApi = ``;
        if (employeeSupervisorContableId == null) {
          urlApi =
            'PresentacionJuntaComite/AutorizarContable/' +
            id +
            '/' +
            this.authService.applicationUserId;
        } else {
          urlApi = 'PresentacionJuntaComite/RevocarContable/' + id;
        }
        this.apiRequestService.onGetList(urlApi).then((result: any) => {
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
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
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
