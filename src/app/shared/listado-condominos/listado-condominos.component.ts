import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { SharedModule } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/destinatarios-mail-reporte.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import TableHeaderComponent from '../table-header/table-header.component';
@Component({
  selector: 'app-listado-condominos',
  templateUrl: './listado-condominos.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    TableModule,
    SharedModule,
    TableHeaderComponent,
    FormsModule,
  ],
})
export default class ListadoCondominosComponent implements OnInit {
  customerIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);

  ref = inject(DynamicDialogRef);
  data: any[] = [];
  destinatariosFinal: IDestinatariosMailReporte[] = [];

  ngOnInit(): void {
    this.onLoadSelectItem();
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(
        `ResidentesEdificio/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.data = response;
      });
  }

  onSendListCondominos() {
    this.destinatariosFinal = [];
    this.data.forEach((resp: any) => {
      let correo: IDestinatariosMailReporte;
      if (resp.select !== undefined && resp.email !== null) {
        if (resp.select) {
          const correoFiltro = {
            nivelPrivacidad: resp.nivelPrivacidad,
            emailResidente: resp.email,
          };

          correo = resp.email;
          this.destinatariosFinal.push(correoFiltro);
        }
      }
    });
    this.ref.close(this.destinatariosFinal);
  }

  onSelectAll() {
    this.data.forEach((resp) => {
      resp.select = true;
    });
  }
  onDeselecteAll() {
    this.data.forEach((resp) => {
      resp.select = false;
    });
  }
}
