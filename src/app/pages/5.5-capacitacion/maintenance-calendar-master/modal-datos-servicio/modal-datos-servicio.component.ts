import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import TarjetaProveedorComponent from 'src/app/pages/6.1-directorios/directorios/proveedor/tarjeta-proveedor/tarjeta-proveedor.component';
@Component({
  selector: 'app-modal-datos-servicio',
  templateUrl: './modal-datos-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ModalDatosServicioComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  dialogService = inject(DialogService);
  data: any;
  proveedores: any;
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.data = this.config.data;
    this.proveedores = this.config.data.proveedores;
  }
  onDataProveedor(id: number) {
    this.ref = this.dialogService.open(TarjetaProveedorComponent, {
      data: {
        id,
      },
      header: 'Datos de proveedor',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
}
