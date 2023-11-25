import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/IDestinatariosMailReporte.interface';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import TableHeaderComponent from '../table-header/table-header.component';

@Component({
  selector: 'app-listado-condominos',
  templateUrl: './listado-condominos.component.html',
  standalone: true,
  imports: [
    TableModule,
    SharedModule,
    TableHeaderComponent,
    FormsModule,
    // EHabitantPipe,
  ],
})
export default class ListadoCondominosComponent implements OnInit {
  private selectItemService = inject(SelectItemService);
  public customerIdService = inject(CustomerIdService);
  public ref = inject(DynamicDialogRef);
  data: any[] = [];
  destinatariosFinal: IDestinatariosMailReporte[] = [];

  ngOnInit(): void {
    this.onLoadSelectItem();
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `ResidentesEdificio/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp: any) => {
        this.data = resp;
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
