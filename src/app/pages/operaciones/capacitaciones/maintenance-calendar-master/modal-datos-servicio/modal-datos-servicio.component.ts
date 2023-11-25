import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import TarjetaProveedorComponent from 'src/app/pages/operaciones/directorios/proveedor/tarjeta-proveedor/tarjeta-proveedor.component';

@Component({
  selector: 'app-modal-datos-servicio',
  templateUrl: './modal-datos-servicio.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export default class ModalDatosServicioComponent implements OnInit {
  public config = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
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
