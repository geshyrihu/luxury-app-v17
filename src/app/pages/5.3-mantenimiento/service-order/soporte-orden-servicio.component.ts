import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-soporte-orden-servicio',
  templateUrl: './soporte-orden-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SoporteOrdenServicioComponent
  implements OnInit, OnDestroy
{
  dateService = inject(DateService);
  private route = inject(ActivatedRoute);
  dataService = inject(DataConnectorService);
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);

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
    this.dataService
      .get(`ServiceOrders/SoporteOrdenServicio/${this.id}`)
      .subscribe((resp: any) => {
        this.nameCarpetaFecha = this.dateService.getDateFormat(
          resp.body.fechaSolicitud
        );
        this.item = resp.body;
      });
  }
  onLoadData() {
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe((resp: any) => {
        this.dataCustomer = resp.body;
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = resp.body.photoPath;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
