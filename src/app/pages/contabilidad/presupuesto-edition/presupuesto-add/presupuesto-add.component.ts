import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
  selector: 'app-presupuesto-add',
  templateUrl: './presupuesto-add.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [MessageService, DialogService, CustomToastService],
})
export default class PresupuestoAddComponent implements OnInit {
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);

  periodo: IPresupuestoAdd;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: number = 0;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.periodo = {
      customerId: this.customerIdService.customerId,
      from: this.dateService.formatDateTime(
        this.rangoCalendarioService.fechaInicial
      ),
      to: this.dateService.formatDateTime(
        this.rangoCalendarioService.fechaFinal
      ),
    };

    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.periodo = {
        customerId: this.customerIdService.customerId,
        from: resp.fechaInicio,
        to: resp.fechaFinal,
      };
    });
  }

  onSubmit() {
    if (this.id === 0) {
      // Mostrar un mensaje de carga
      this.customToastService.onLoading();
      this.dataService
        .post(`Presupuesto/Create`, this.periodo)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`Presupuesto/UpdatePresupuesto/${this.id}`, this.periodo)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  onLoadData() {
    this.dataService
      .get(`Presupuesto/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.periodo = {
            customerId: this.customerIdService.customerId,
            from: resp.fechaInicio,
            to: resp.fechaFinal,
          };
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
}
export interface IPresupuestoAdd {
  from: string;
  to: string;
  customerId: number;
}
