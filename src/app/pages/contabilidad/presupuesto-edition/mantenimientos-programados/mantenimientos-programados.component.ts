import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-mantenimientos-programados',
  templateUrl: './mantenimientos-programados.component.html',
  standalone: true,
  imports: [PrimeNgModule],
})
export default class MantenimientosProgramadosComponent
  implements OnInit, OnDestroy
{
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  data: any[] = [];
  subRef$: Subscription;
  cuentaId: number = 0;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.cuentaId = this.config.data.cuentaId;
    if (this.cuentaId !== 0) this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .get(
        `Presupuesto/ServiciosMttoProgramados/${
          this.cuentaId
        }/${this.customerIdService.getcustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          // Oculta el mensaje de carga
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
