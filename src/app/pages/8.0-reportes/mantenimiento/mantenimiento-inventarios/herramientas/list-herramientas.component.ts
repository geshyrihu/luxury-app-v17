import { Component, OnInit, inject } from "@angular/core";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Observable } from "rxjs";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ReporteHerramientasPdfService } from "src/app/core/services/reporte-herramientas-pdf.service";
import AddoreditToolsComponent from "./addoredit-herramienta.component";

@Component({
  selector: "app-list-herramientas",
  templateUrl: "./list-herramientas.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListerramientasComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);

  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);

  base_urlImg = "";
  data: any[] = [];

  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `Tools/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.reporteHerramientasPdfService.setData(this.data);
    });
  }

  onDelete(id: number) {
    this.apiRequestService.onDelete(`Tools/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditToolsComponent,
        { id: data.id },
        data.title,
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
