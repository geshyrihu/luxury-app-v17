import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-presupuesto-add',
  templateUrl: './presupuesto-add.component.html',
  standalone: true,
  imports: [ComponentsModule],
})
export default class PresupuestoAddComponent implements OnInit {
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);

  periodo: IPresupuestoAdd;
  subRef$: Subscription;
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
      this.subRef$ = this.dataService
        .post(`Presupuesto/Create`, this.periodo)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`Presupuesto/UpdatePresupuesto/${this.id}`, this.periodo)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }
  onLoadData() {
    this.subRef$ = this.dataService.get(`Presupuesto/${this.id}`).subscribe({
      next: (resp: any) => {
        this.periodo = {
          customerId: this.customerIdService.customerId,
          from: resp.fechaInicio,
          to: resp.fechaFinal,
        };
      },
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }
}
export interface IPresupuestoAdd {
  from: string;
  to: string;
  customerId: number;
}
