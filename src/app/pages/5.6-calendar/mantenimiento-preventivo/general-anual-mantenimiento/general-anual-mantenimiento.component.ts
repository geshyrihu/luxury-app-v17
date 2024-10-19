import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-general-anual-mantenimiento',
  templateUrl: './general-anual-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class GeneralAnualMantenimientoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  cb_providers: ISelectItem[] = [];
  providerId = '';
  pathImg = '';

  ngOnInit() {
    this.onLoadData();
    this.onLoadProveedores();
    this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`;
    this.customerId$.subscribe((resp) => {
      this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`;
      this.onLoadData();
    });
  }
  onLoadProveedores() {
    this.cb_providers = [];
    const url = `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(url).then((result: any) => {
      this.cb_providers = result;
    });
  }
  onLoadData() {
    this.data = [];
    const url = `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdService.customerId}/${this.providerId}`;
    this.apiRequestService.onGetList(url).then((result: any) => {
      this.data = result;
    });
  }
}
