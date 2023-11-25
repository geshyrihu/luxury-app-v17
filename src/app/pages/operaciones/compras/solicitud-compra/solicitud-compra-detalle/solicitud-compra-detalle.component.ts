import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';
import ComponentsModule from 'src/app/shared/components.module';
import EditProductoComponent from '../edit-producto.component';

@Component({
  selector: 'app-solicitud-compra-detalle',
  templateUrl: './solicitud-compra-detalle.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
})
export default class SolicitudCompraDetalleComponent {
  private dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  private solicitudCompraService = inject(SolicitudCompraService);

  subRef$: Subscription;

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

  onDeleteProduct(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`SolicitudCompraDetalle/${data.id}`)
      .subscribe({
        next: () => {
          this.onUpdateData();
          this.solicitudCompraService.onDeleteProduct();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
