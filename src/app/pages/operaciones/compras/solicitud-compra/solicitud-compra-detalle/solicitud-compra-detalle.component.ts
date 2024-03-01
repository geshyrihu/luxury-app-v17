import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';
import EditProductoComponent from '../edit-producto.component';

@Component({
  selector: 'app-solicitud-compra-detalle',
  templateUrl: './solicitud-compra-detalle.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SolicitudCompraDetalleComponent {
  private dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private solicitudCompraService = inject(SolicitudCompraService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  @Input()
  SolicitudCompraDetalle: any[] = [];
  @Input()
  solicitudCompraId: number = 0;

  @Output()
  updateData = new EventEmitter<void>();
  ref: DynamicDialogRef;

  editProduct(data: any) {
    this.ref = this.dialogService.open(EditProductoComponent, {
      data: {
        solicitudCompraId: this.solicitudCompraId,
        id: data.id,
      },
      header: 'Editar Producto',
      width: '600px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onUpdateData();
        // this.onLoadData();
      }
    });
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDeleteProduct(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`SolicitudCompraDetalle/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onUpdateData();
          this.solicitudCompraService.onDeleteProduct();
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
