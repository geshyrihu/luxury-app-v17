import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { INewProfession } from 'src/app/core/interfaces/new-profession.interface';
import { IProfession } from 'src/app/core/interfaces/profession.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import AddOrEditProfessionsComponent from './addoredit-professions.component';
import DescripcionPuestoComponent from './descripcion-puesto.component';

@Component({
  selector: 'app-professions',
  templateUrl: './list-professions.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListProfessionsComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IProfession>('Professions/')
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

  onRowReorder(event: any) {
    let movedItem = this.data[event.dragIndex];

    this.data.splice(event.dragIndex, 1);
    this.data.splice(event.dropIndex, 0, movedItem);

    let newdate: INewProfession[] = [];
    for (let i = 0; i < this.data.length; i++) {
      const elemento: INewProfession = {
        hierarchy: i,
        id: this.data[i].id,
      };

      newdate.push(elemento);
    }
    this.dataService
      // .get(`Professions/UpdateHierarchy/${item.id}/${event.dropIndex}`)
      .post(`Professions/ResetHierarchy/`, newdate)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDelete(data: IProfession) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete('Professions/' + data.id)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditProfessionsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onModalDescripcionPuestos(data: any) {
    this.ref = this.dialogService.open(DescripcionPuestoComponent, {
      data: {
        id: data.id,
      },
      header: data.nameProfession,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
