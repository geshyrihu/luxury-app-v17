import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/5.6-calendar/mantenimiento-preventivo/addoredit-maintenance-preventive.component';

//TODO: VALIDAR SU AUN ESTA ACTIVO ESTE MODULO
@Component({
  selector: 'app-service-order',
  templateUrl: './service-order.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ServiceOrderComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  public confirmationService = inject(ConfirmationService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  maintenanceCalendars: any[] = [];
  idMachinery: number = 0;

  public editorConfig = {
    readOnly: true, // Opciones del editor, incluyendo readOnly
  };

  ngOnInit(): void {
    this.idMachinery = this.config.data.id;

    if (this.idMachinery !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.dataService
      .get(`MaintenanceCalendars/ListService/${this.idMachinery}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.maintenanceCalendars = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Desea Eliminar este registro?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.dataService
          .delete(`MaintenanceCalendars/${id}`)
          .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
          .subscribe({
            next: () => {
              this.customToastService.onShowSuccess();
              this.onLoadData();
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      },
      reject: () => {
        //reject action
      },
    });
  }
  showModalMaintenanceCalendar(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        header: data.header,
        styleClass: 'modal-mdInventory',
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
  // TODO: PARECE QUE ESTE METODO NO SE UTILIZA
  deleteMaintenanceOrder(id: number) {
    this.dataService
      .delete(`MaintenanceCalendars/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
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
