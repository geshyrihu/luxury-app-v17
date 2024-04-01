import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-info-cuenta',
  templateUrl: './info-cuenta.component.html',
  standalone: true,
})
export default class InfoCuentaComponent implements OnInit, OnDestroy {
  config = inject(DynamicDialogConfig);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  private customToastService = inject(CustomToastService);

  id: number = 0;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  info: string = '';

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`Cuentas/Info/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.info = resp.body.information;
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
