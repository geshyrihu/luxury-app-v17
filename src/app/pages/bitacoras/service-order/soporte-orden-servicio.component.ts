import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-soporte-orden-servicio',
  templateUrl: './soporte-orden-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SoporteOrdenServicioComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);
  route = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);

  id: string = '';
  item: any;
  dataCustomer: any;
  urlImg: string = '';
  nameCarpetaFecha: string = '';
  logoCustomer = '';
  nameCustomer = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.onLoadItem();
    this.onLoadData();
  }
  onLoadItem() {
    const urlApi = `ServiceOrders/SoporteOrdenServicio/${this.id}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.nameCarpetaFecha = this.dateS.getDateFormat(result.fechaSolicitud);
      this.item = result;
    });
  }
  onLoadData() {
    const urlApi = `Customers/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.dataCustomer = result;
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = result.photoPath;
    });
  }
}
