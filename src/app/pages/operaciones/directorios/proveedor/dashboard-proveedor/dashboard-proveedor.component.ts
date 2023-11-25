import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import BuscadorProvedorComponent from '../buscador-proveedor/buscador-proveedor.component';
import ListProviderComponent from '../buscador-proveedor/list-provider.component';

@Component({
  selector: 'app-dashboard-proveedor',
  templateUrl: './dashboard-proveedor.component.html',
  standalone: true,
  imports: [
    NgbAlert,
    BuscadorProvedorComponent,
    ListProviderComponent,
    CommonModule,
    ComponentsModule,
  ],
})
export default class DashboardProveedorComponent {
  mostrarBuscador: boolean = true;
  url =
    environment.base_public + 'documentos/operaciones/glb-altaproveedor.docx';
}
