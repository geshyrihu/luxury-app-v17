import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';

import AddoreditPeriodoCedulaPresupuestalComponent from '../../../operaciones/compras/cedula-presupuestal/addoredit-periodo-cedula.component';
import PresupuestoAddComponent from '../presupuesto-add/presupuesto-add.component';

@Component({
  selector: 'app-list-presupuesto',
  templateUrl: './list-presupuesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListPresupuestoComponent implements OnInit {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public router = inject(Router);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`Presupuesto/GetList/${this.customerIdService.customerId}`)
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

  onFinished(cedulaId: number, finished: boolean) {
    this.dataService
      .get(`Presupuesto/Finished/${cedulaId}/${finished}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          // Actualiza solo el registro afectado en lugar de toda la lista
          const updatedRecord = resp.body;
          const recordIndex = this.data.findIndex(
            (record) => record.id === updatedRecord.id
          );
          if (recordIndex !== -1) {
            this.data[recordIndex] = updatedRecord;
          }
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onAddPresupuesto(id: number) {
    this.ref = this.dialogService.open(PresupuestoAddComponent, {
      header: 'Agregar presupuesto',
      data: {
        id,
      },
      height: 'auto',
      styleClass: 'modal-sm',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe(() => {
      this.onLoadData();
    });
  }

  onModalAddOrEdit(id: number) {
    this.ref = this.dialogService.open(
      AddoreditPeriodoCedulaPresupuestalComponent,
      {
        data: {
          cedulaId: id,
        },
        header: 'Editar Periodo',
        height: 'auto',
        styleClass: 'modal-sm',
        baseZIndex: 10000,
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
  onGetPresupuestoDetalle(id: number) {
    this.router.navigate(['/operaciones/compras/presupuesto-individual/', id]);
  }

  // Función para eliminar
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`presupuesto/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
