import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IListCondomino } from 'src/app/core/interfaces/list-condomino.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CondominosAddOrEditComponent from './condominos-addoredit.component';

@Component({
    selector: 'app-condominos-list',
    templateUrl: './condominos-list.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListCondominosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  data: IListCondomino[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `ListCondomino/GetAllAsync/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`listcondomino/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        CondominosAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      return this.customCompare(data1.property, data2.property);
    });
  }

  private customCompare(x: string, y: string): number {
    const regex = /(\D+)|(\d+)/g;
    const xMatches = x.match(regex);
    const yMatches = y.match(regex);

    const minMatches = Math.min(xMatches.length, yMatches.length);

    for (let i = 0; i < minMatches; i++) {
      const xPart = xMatches[i];
      const yPart = yMatches[i];

      let comparisonResult;

      // Si ambos son numéricos, los comparamos como enteros
      if (!isNaN(parseInt(xPart, 10)) && !isNaN(parseInt(yPart, 10))) {
        comparisonResult = parseInt(xPart, 10) - parseInt(yPart, 10);
      } else {
        // Si no son numéricos, comparamos como cadenas
        comparisonResult = xPart.localeCompare(yPart);
      }

      if (comparisonResult !== 0) {
        return comparisonResult;
      }
    }

    // Si todos los elementos hasta ahora son iguales, el más corto es menor
    return xMatches.length - yMatches.length;
  }
}
