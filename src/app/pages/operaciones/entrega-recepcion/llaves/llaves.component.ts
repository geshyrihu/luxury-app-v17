import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-llaves',
  templateUrl: './llaves.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class LlavesComponent implements OnInit, OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  data: any[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

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
    this.dataService
      .get(
        'EntregaRecepcion/InventarioLlaves/' + this.customerIdService.customerId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
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
        if (customer.descripcion === name) {
          total++;
        }
      }
    }
    return total;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
