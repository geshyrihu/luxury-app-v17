import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IMedidorCategoriaDto } from 'src/app/core/interfaces/IMedidorCategoriaDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import FormMedidorCategoriaComponent from './addoredit-medidor-categoria.component';

@Component({
  selector: 'app-list-medidor-categoria',
  templateUrl: './list-medidor-categoria.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListMedidorCategoriaComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  data: IMedidorCategoriaDto[] = [];
  ref: DynamicDialogRef;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IMedidorCategoriaDto[]>(`MedidorCategoria`)
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
      .onDelete(`medidorcategoria/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(FormMedidorCategoriaComponent, {
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
