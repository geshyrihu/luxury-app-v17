import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cabecera-solicitud-pago-pdf',
  templateUrl: './cabecera-solicitud-pago-pdf.component.html',
  standalone: true,
  imports: [NgIf],
  providers: [CustomToastService],
})
export default class CabeceraSolicitudPagoPdfComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  data: any;
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get('Customers/' + this.customerIdService.getcustomerId())
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
