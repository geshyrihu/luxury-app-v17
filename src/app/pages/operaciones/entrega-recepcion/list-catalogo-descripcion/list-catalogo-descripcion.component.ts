import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditCatalogoDescripcionComponent from '../addoredit-catalogo-descripcion/addoredit-catalogo-descripcion.component';

@Component({
  selector: 'app-list-catalogo-descripcion',
  templateUrl: './list-catalogo-descripcion.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListCatalogoDescripcionComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
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
      .get<any[]>('CatalogoEntregaRecepcionDescripcion')
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
      .onDelete(`catalogoentregarecepciondescripcion/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditCatalogoDescripcionComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
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
