import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import MaintenancePreventiveAddoreditComponent from '../mantenimiento-preventivo/maintenance-preventive-addoredit.component';
const date = new Date();

@Component({
    selector: 'app-listado-anual-mantenimiento',
    templateUrl: './listado-anual-mantenimiento.component.html',
    imports: [LuxuryAppComponentsModule, CurrencyMexicoPipe]
})
export default class ListadoAnualMantenimientoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  month = date.getMonth();
  months: ISelectItem[] = [];

  ngOnInit() {
    this.onLoadEnumSelectItem();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const url = `MaintenanceCalendars/GetAll/${this.customerIdS.getCustomerId()}/${
      this.month
    }`;
    this.apiRequestS.onGetList(url).then((responseData: any) => {
      this.data = responseData;
    });
  }
  calculateCustomerTotal(name: any) {
    let total = 0;
    if (this.data) {
      for (let customer of this.data) {
        if (customer.inventoryCategory === name) {
          total++;
        }
      }
    }
    return total;
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`maintenancecalendars/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        MaintenancePreventiveAddoreditComponent,
        {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        data.title,
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  selectMonth() {
    this.month = this.month;
    this.onLoadData();
  }
  onLoadEnumSelectItem() {
    this.apiRequestS
      .onGetEnumSelectItem(`EMonth/${false}`)
      .then((responseData: any) => {
        this.months = responseData;
        this.months.sort((a, b) => a.value - b.value);
      });
  }
}
