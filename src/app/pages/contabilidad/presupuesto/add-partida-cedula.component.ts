import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CedulaPresupuestalDetalleAddOrEdit } from 'src/app/core/interfaces/ICedulaPresupuestalDetalleAddOrEdit.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-add-partida-cedula',
  templateUrl: './add-partida-cedula.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddPartidaCedulaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  public ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  cedulaPresupuestalId: number = 0;
  applicationUserId: string = '';
  submitting: boolean = false;

  ngOnInit(): void {
    this.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.cedulaPresupuestalId = this.config.data.idBudgetCard;
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `SelectItem/AddCuentaCedulaPresupuestal/${this.config.data.idBudgetCard}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body.map(function (cuenta: any) {
            return {
              id: cuenta.id,
              numeroCuenta: cuenta.numeroCuenta,
              descripcion: cuenta.descripcion,
              presupuestoMensual: 0,
            };
          });
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit(item: any) {
    let model: CedulaPresupuestalDetalleAddOrEdit =
      new CedulaPresupuestalDetalleAddOrEdit();

    model.cuentaId = item.id;
    model.cedulaPresupuestalId = this.cedulaPresupuestalId;
    model.presupuestoMensual = item.presupuestoMensual;
    model.applicationUserId = this.applicationUserId;
    model.presupuestoEjercido = 0;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(`CedulaPresupuestalDetalles`, model)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
