import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class HerramientasComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);

  data: any[] = [];
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  base_urlImg = environment.base_urlImg;

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'EntregaRecepcion/InventarioHerramientas/' +
          this.customerIdService.customerId
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  calcularEquiposTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }
    return total;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
