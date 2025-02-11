import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';
import OrdenCompraComponent from '../orden-compra/orden-compra.component';

@Component({
  selector: 'app-orden-compra-pagadas',
  templateUrl: './orden-compra-pagadas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CurrencyMexicoPipe],
})
export default class OrdenCompraPagadasComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  tipo = 1;
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData(1);
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData(1);
    });
  }

  onLoadData(type: any) {
    const urlApi = `OrdenCompra/Pagadas/${this.customerIdS.customerId}/${type}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onAddOrEdit(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS
      .openDialog(
        OrdenCompraComponent,
        {
          id,
        },
        'Editar Orden de Compra',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipo);
      });
  }
}
