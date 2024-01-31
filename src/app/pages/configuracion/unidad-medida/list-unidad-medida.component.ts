import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

import AddOrEditUnidadMedidaComponent from './addoredit-unidad-medida.component';

@Component({
  selector: 'app-list-unidad-medida',
  templateUrl: './list-unidad-medida.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListUnidadMedidaComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

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
      .get('UnidadMedida')
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`unidadmedida/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditUnidadMedidaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
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

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
