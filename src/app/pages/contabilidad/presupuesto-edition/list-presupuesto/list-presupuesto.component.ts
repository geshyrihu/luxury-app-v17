import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditPeriodoCedulaPresupuestalComponent from '../../../operaciones/compras/cedula-presupuestal/addoredit-periodo-cedula.component';
import PresupuestoAddComponent from '../presupuesto-add/presupuesto-add.component';

@Component({
  selector: 'app-list-presupuesto',
  templateUrl: './list-presupuesto.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListPresupuestoComponent implements OnInit {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public router = inject(Router);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get(`Presupuesto/GetList/${this.customerIdService.customerId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onFinished(cedulaId: number, finished: boolean) {
    this.subRef$ = this.dataService
      .get(`Presupuesto/Finished/${cedulaId}/${finished}`)
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
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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

  // Función para eliminar un banco
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .delete(`Presupuesto/${data.id}`) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
}
