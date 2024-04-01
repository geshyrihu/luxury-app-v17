import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import AddoreditPiscinaBitacoraComponent from '../addoredit-piscina-bitacora/addoredit-piscina-bitacora.component';
@Component({
  selector: 's-list-piscina-bitacora',
  templateUrl: './list-piscina-bitacora.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListPiscinaBitacoraComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  private rutaActiva = inject(ActivatedRoute);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  piscinaId: number = 0;
  ngOnInit(): void {
    this.piscinaId = this.rutaActiva.snapshot.params.piscinaId;
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get('piscinabitacora/getall/' + this.piscinaId)
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
      .onDelete(`piscinabitacora/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditPiscinaBitacoraComponent, {
      data: {
        id: data.id,
        piscinaId: this.piscinaId,
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
