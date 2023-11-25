import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LocaleSettings } from 'primeng/calendar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  FiltroCalendarService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import FormBitacoraMantenimientoComponent from './form-bitacora-mantenimiento.component';

@Component({
  selector: 'app-bitacora-mantenimiento',
  templateUrl: './bitacora-mantenimiento.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class BitacoraMantenimientoComponent
  implements OnInit, OnDestroy
{
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public dataService = inject(DataService);
  public authServide = inject(AuthService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public rangoCalendarioService = inject(FiltroCalendarService);

  customerList: any[] = [];
  subRef$: Subscription;

  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  es: LocaleSettings;
  data: any[];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
  }

  onFilter() {
    this.onLoadData();
  }

  onDelte(item: any) {
    this.subRef$ = this.dataService
      .delete(`BitacoraMantenimiento/${item.id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onModalFormBiacora(data: any) {
    this.ref = this.dialogService.open(FormBitacoraMantenimientoComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Tarjeta de Usuario',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `BitacoraMantenimiento/GetAll/${this.customerIdService.customerId}/${this.fechaInicial}/${this.fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
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
