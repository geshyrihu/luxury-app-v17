import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { IFondeoCaratula } from 'src/app/core/interfaces/fondeo-caratula.interface';
import {
  IItemsFondeoCaratula,
  TableRowItemFondeoCaratulaDto,
} from 'src/app/core/interfaces/items-fondeo-caratula.interface';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CaratulaFondeoService } from 'src/app/core/services/caratula-fondeo.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DateService } from 'src/app/core/services/date.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vista-caratula-fondeo',
  templateUrl: './vista-caratula-fondeo.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ContextMenuModule, CurrencyMexicoPipe],
})
export default class VistaCaratulaFondeoComponent implements OnInit {
  dateService = inject(DateService);
  caratulaFondeoService = inject(CaratulaFondeoService);
  apiRequestService = inject(ApiRequestService);
  router = inject(Router);
  customToastService = inject(CustomToastService);

  data: IFondeoCaratula;
  dataSelect: any;
  items: MenuItem[] = [
    {
      label: 'Eliminar',
      icon: 'fa-regular fa-xmark',
      command: () => this.viewItem(this.dataSelect),
    },
  ];
  cols: any[];
  baseUrlImg = environment.base_urlImg;
  logoLuxury = `${environment.base_urlImg}logo2.jpg`;

  ngOnInit(): void {
    this.onLoadData();
    if (this.data !== undefined) {
      this.items = [
        {
          label: 'Eliminar',
          icon: 'fa-regular fa-xmark',
          command: () => this.viewItem(this.dataSelect),
        },
      ];
    }
  }

  onLoadData() {
    if (this.caratulaFondeoService.requestFondeoCaratulaDto === undefined) {
      this.router.navigateByUrl('compras/ordenesCompra');
    } else {
      this.apiRequestService
        .onPost(
          'OrdenCompra/Fondeo/',
          this.caratulaFondeoService.requestFondeoCaratulaDto
        )
        .then((result: any) => {
          this.data = undefined;
          this.data = result;
          if (result !== undefined) {
          }
        });
    }
  }

  viewItem(model: IItemsFondeoCaratula) {
    var i = this.data.itemsFondeoCaratulaDto.indexOf(model);
    if (i !== -1) {
      this.data.itemsFondeoCaratulaDto.splice(i, 1);

      this.data.totalImporte = this.data.totalImporte - model.importe;
      this.data.totalIva = this.data.totalIva - model.iva;
      this.data.totalTotales = this.data.totalTotales - model.totales;
    }
  }

  extractData(data: IItemsFondeoCaratula[]): TableRowItemFondeoCaratulaDto[] {
    return data.map((row, index) => [
      (row.id = index + 1),
      this.dateService.formDateToStringLocale(new Date(row.fecha)),
      row.acreedor,
      row.factura,
      row.concepto,
      this.onFormtatMoney(Number(row.importe)),
      this.onFormtatMoney(Number(row.iva)),
      this.onFormtatMoney(Number(row.totales)),

      row.banco,
      row.cuentaDeposito,
    ]);
  }
  ///fORMATO MODENA
  onFormtatMoney(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  }
}
