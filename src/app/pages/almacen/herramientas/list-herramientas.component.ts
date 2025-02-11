import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ReporteHerramientasPdfService } from 'src/app/core/services/reporte-herramientas-pdf.service';
import AddoreditToolsComponent from './addoredit-herramienta.component';

@Component({
  selector: 'app-list-herramientas',
  templateUrl: './list-herramientas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListerramientasComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);

  data: any[] = [];

  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `Tools/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
      this.reporteHerramientasPdfService.setData(this.data);
    });
  }

  onDelete(id: number) {
    this.apiRequestS.onDelete(`Tools/${id}`).then((responseData: boolean) => {
      if (responseData) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditToolsComponent,
        { id: data.id },
        data.title,
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
