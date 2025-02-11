import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import TarjetaProveedorComponent from 'src/app/pages/directorios/proveedor/tarjeta-proveedor.component';

@Component({
  selector: 'app-datos-servicio-addoredit',
  templateUrl: './datos-servicio-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DatosServicioAddOrEditComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  dialogS = inject(DialogService);
  data: any;
  proveedores: any;
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.data = this.config.data;
    this.proveedores = this.config.data.proveedores;
  }
  onDataProveedor(id: number) {
    this.ref = this.dialogS.open(TarjetaProveedorComponent, {
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
