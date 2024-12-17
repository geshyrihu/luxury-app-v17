import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { LocaleSettings } from 'primeng/calendar';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import CardEmployeeComponent from 'src/app/pages/6.1-directorios/employee/card-employee/card-employee.component';
import FormBitacoraMantenimientoComponent from './form-bitacora-mantenimiento.component';

@Component({
  selector: 'app-bitacora-mantenimiento',
  templateUrl: './bitacora-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class BitacoraMantenimientoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  dateService = inject(DateService);
  authServide = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  rangoCalendarioService = inject(FiltroCalendarService);

  customerList: any[] = [];

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
  onLoadData() {
    const urlApi = `BitacoraMantenimiento/GetAll/${this.customerIdService.customerId}/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onFilter() {
    this.onLoadData();
  }

  onDelete(item: any) {
    this.apiRequestService
      .onDelete(`BitacoraMantenimiento/${item.id}`)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  onModalFormBiacora(data: any) {
    this.dialogHandlerService
      .openDialog(
        FormBitacoraMantenimientoComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerService.dialogSizeMd
    );
  }
}
