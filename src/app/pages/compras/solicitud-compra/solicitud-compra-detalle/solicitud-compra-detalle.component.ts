import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';
import EditProductoComponent from '../edit-producto.component';

@Component({
    selector: 'app-solicitud-compra-detalle',
    templateUrl: './solicitud-compra-detalle.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class SolicitudCompraDetalleComponent {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  solicitudCompraService = inject(SolicitudCompraService);

  @Input()
  SolicitudCompraDetalle: any[] = [];
  @Input()
  solicitudCompraId: number = 0;

  @Output()
  updateData = new EventEmitter<void>();
  ref: DynamicDialogRef;

  editProduct(data: any) {
    this.dialogHandlerS
      .openDialog(
        EditProductoComponent,
        {
          solicitudCompraId: this.solicitudCompraId,
          id: data.id,
        },
        'Editar Producto',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onUpdateData();
      });
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDeleteProduct(id: number) {
    this.apiRequestS.onDelete(`solicitudcompradetalle/${id}`).then(() => {
      this.onUpdateData();
      this.solicitudCompraService.onDeleteProduct();
    });
  }
}
