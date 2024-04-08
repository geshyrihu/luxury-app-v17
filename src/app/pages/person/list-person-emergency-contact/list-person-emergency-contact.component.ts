import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { NgxMaskModule } from 'ngx-mask';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import AddoreditPersonEmergencyContactComponent from '../addoredit-person-emergency-contact/addoredit-person-emergency-contact.component';

@Component({
  selector: 'app-list-person-emergency-contact',
  templateUrl: './list-person-emergency-contact.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgxMaskModule],
  providers: [MessageService, ConfirmationService, CustomToastService],
})
export default class ListPersonEmergencyContactComponent
  implements OnInit, OnDestroy
{
  config = inject(DynamicDialogConfig);
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService);
  ref = inject(DynamicDialogRef);

  dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  personId: number = 0;
  id: string = '';
  contactEmployeeAdd: any;

  data: any[] = [];
  ngOnInit(): void {
    this.personId = this.config.data.personId;
    this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`personemergencycontact/listtoperson/${this.personId}`)
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

  onDelete(item: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`ContactEmployees/${item.id}`)
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

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddoreditPersonEmergencyContactComponent,
      {
        data: {
          personId: this.personId,
          id: data.id,
        },
        header: data.title,
        styleClass: 'modal-md ',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
