import { Component, OnDestroy, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonModule],
  standalone: true,
  providers: [MessageService, CustomToastService],
})
export default class DepuracionComponent implements OnDestroy {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ActualizarDatosEmpleadoContatoData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('Depuracion/ActualizarDatosEmpleadoContatoData')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (_) => {
          this.customToastService.onShowSuccess();
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  UpdateAccounts() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('depuracion/updateaccounts')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (_) => {
          this.customToastService.onShowSuccess();
          this.customToastService.onClose();
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
