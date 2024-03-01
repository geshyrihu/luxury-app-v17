import {} from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cabecera-solicitud-pago-pdf',
  templateUrl: './cabecera-solicitud-pago-pdf.component.html',
  standalone: true,
})
export default class CabeceraSolicitudPagoPdfComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  data: any;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  url: string = environment.base_urlImg + 'Administration/customer/';
  @Input()
  titulo: string = '';
  @Input()
  folio: string = '';
  @Input()
  factura: string = '';

  ngOnInit(): void {
    this.onloadData();
  }

  onloadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('Customers/' + this.customerIdService.getcustomerId())
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

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
