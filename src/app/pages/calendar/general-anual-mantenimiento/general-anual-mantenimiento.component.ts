import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-general-anual-mantenimiento',
  templateUrl: './general-anual-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class GeneralAnualMantenimientoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  cb_providers: ISelectItem[] = [];
  providerId = '';

  ngOnInit() {
    this.onLoadData();
    this.onLoadProveedores();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }
  onLoadProveedores() {
    this.cb_providers = [];
    const url = `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(url).then((result: any) => {
      this.cb_providers = result;
    });
  }
  onLoadData() {
    this.data = [];
    const url = `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdS.customerId}/${this.providerId}`;
    this.apiRequestS.onGetList(url).then((result: any) => {
      this.data = result;
    });
  }
}
