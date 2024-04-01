import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-organigrama-interno',
  templateUrl: './organigrama-interno.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrganigramaInternoComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);

  nameCustomer: string = '';
  logoCustomer: string = '';
  data: any[] = [];
  baseUrlImg = environment.base_urlImg;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.OnLoadCustomer();
    this.customerId$.subscribe(() => {
      this.onLoadData();
      this.OnLoadCustomer();
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('OrganigramaInterno/' + this.customerIdService.getcustomerId())
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
  OnLoadCustomer() {
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
