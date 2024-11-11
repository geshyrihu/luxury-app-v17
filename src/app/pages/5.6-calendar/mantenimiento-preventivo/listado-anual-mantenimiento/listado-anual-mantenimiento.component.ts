import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { EMonth } from 'src/app/core/enums/month.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditMaintenancePreventiveComponent from '../addoredit-maintenance-preventive.component';
const date = new Date();

@Component({
  selector: 'app-listado-anual-mantenimiento',
  templateUrl: './listado-anual-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CurrencyMexicoPipe],
})
export default class ListadoAnualMantenimientoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  month = date.getMonth();
  months: ISelectItem[] = onGetSelectItemFromEnum(EMonth);

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const url = `MaintenanceCalendars/GetAll/${this.customerIdService.getCustomerId()}/${
      this.month
    }`;
    this.apiRequestService.onGetList(url).then((result: any) => {
      this.data = result;
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
    this.apiRequestService
      .onDelete(`maintenancecalendars/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditMaintenancePreventiveComponent,
        {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        data.title,
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  selectMonth() {
    this.month = this.month;
    this.onLoadData();
  }
}
