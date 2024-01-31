import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  FiltroCalendarService,
} from 'src/app/core/services/common-services';

import Swal from 'sweetalert2';
import AddPresentacionJuntaComiteComponent from './add-presentacion-junta-comite/add-presentacion-junta-comite.component';
import AddoreditPresentacionJuntaComiteComponent from './addoredit-presentacion-junta-comite/addoredit-presentacion-junta-comite.component';
import EnviarMailEstadosFinancierosComponent from './enviar-mail-estados-financieros/enviar-mail-estados-financieros.component';

@Component({
  selector: 'app-presentacion-junta-comite',
  templateUrl: './presentacion-junta-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresentacionJuntaComiteComponent
  implements OnInit, OnDestroy
{
  private rangoCalendarioService = inject(FiltroCalendarService);
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public route = inject(Router);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  enviarEstadosFinancierosCondominos(id: any) {
    this.ref = this.dialogService.open(EnviarMailEstadosFinancierosComponent, {
      data: {
        id,
      },
      header: 'ENVIAR ESTADOS FINANCIEROS',
      baseZIndex: 1000,
      height: '100%',
      width: '100%',
      closeOnEscape: true,
      maximizable: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  applicationUserId: string = '';
  url: string = '';

  estatusParteContable: boolean = false;
  supervisorContable: boolean = false;

  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicial
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinal
  );

  onValidarId(userId: string): boolean {
    if (
      userId == this.authService.userTokenDto.infoUserAuthDto.applicationUserId
    ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.url =
      'customers/' + this.customerIdService.getcustomerId() + '/presentacion/';
    this.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
      this.url =
        'customers/' +
        this.customerIdService.getcustomerId() +
        '/presentacion/';
    });
  }
  onValidateContabilidad(id: number, employeeSupervisorContableId: number) {
    if (employeeSupervisorContableId == null) {
      this.onAutorizarContabilidad(id);
    } else {
      this.onRevocarContabilidad(id);
    }
  }
  onValidateEstadosFinancieros(
    id: number,
    employeeSupervisorContableId: number
  ) {
    if (employeeSupervisorContableId == null) {
      this.onAutorizarFinancieros(id);
    } else {
      this.onRevocarFinancieros(id);
    }
  }
  onLoadData(): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `PresentacionJuntaComite/GetAll/${this.customerIdService.getcustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddoreditPresentacionJuntaComiteComponent,
      {
        data: {
          id: data.id,
          titulo: data.titulo,
        },
        header: data.titulo,
        styleClass: 'modal-lg',
        autoZIndex: true,
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalAdd(data: any) {
    this.ref = this.dialogService.open(AddPresentacionJuntaComiteComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //* Eliminar pdf
  onDelete(item: any, area: string) {
    this.dataService
      .delete('PresentacionJuntaComite/' + item.id + '/' + area)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  // *Eliminar registro completo
  onDeleteItem(item: any) {
    this.dataService
      .delete('PresentacionJuntaComite/' + item.id)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onValidarPresentacion(id: number) {
    this.dataService
      .get(
        'PresentacionJuntaComite/AutorizarPresentacion/' +
          id +
          '/' +
          this.authService.userTokenDto.infoEmployeeDto.employeeId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onAutorizarContabilidad(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Confirmo que la parte contable es correcta!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
      }
    });
    this.dataService
      .get(
        'PresentacionJuntaComite/AutorizarContable/' +
          id +
          '/' +
          this.authService.userTokenDto.infoEmployeeDto.employeeId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onRevocarContabilidad(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Se va a revocar la revisión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.dataService
          .get('PresentacionJuntaComite/RevocarContable/' + id)
          .subscribe({
            next: (resp: any) => {
              this.onLoadData();
              Swal.fire(
                'Completado!',
                'Se ha creado el archivo final.',
                'success'
              );
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      }
    });
  }

  onAutorizarFinancieros(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Confirmo que los estados financieros estan correctos!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.dataService
          .get(
            'PresentacionJuntaComite/AutorizarEstadosFinancieros/' +
              id +
              '/' +
              this.authService.userTokenDto.infoEmployeeDto.employeeId
          )
          .subscribe({
            next: (_) => {
              this.onLoadData();
              Swal.fire(
                'Completado!',
                'Se ha creado el archivo final.',
                'success'
              );
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      }
    });
  }

  onRevocarFinancieros(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Se va a revocar la revisión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.dataService
          .get('PresentacionJuntaComite/RevocarEstadosFinancieros/' + id)
          .subscribe({
            next: (resp: any) => {
              this.onLoadData();
              Swal.fire(
                'Completado!',
                'Se ha creado el archivo final.',
                'success'
              );
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      }
    });
  }

  onValidarCargasCompletasPorArea(
    portada: string,
    contabilidad: string,
    operaciones: string
  ): boolean {
    if (portada !== '' && contabilidad !== '' && operaciones !== '') {
      return true;
    } else {
      return false;
    }
  }
  enviarMailTesorero(idJunta: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('SendEmail/EnviarEstadosFinancierosTesorero/' + idJunta)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  enviarMailPresentacionComite(idJunta: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('SendEmail/PresentacionFinalComite/' + idJunta)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
