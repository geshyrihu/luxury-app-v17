import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import StripTagsPipe from 'src/app/core/pipes/StripTags.pipe';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, StripTagsPipe],
})
export default class EquiposComponent implements OnInit, OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];

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
    this.dataService
      .get(
        'entregarecepcion/inventarioequipos/' +
          this.customerIdService.customerId
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
        if (customer.clasificacion === name) {
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
