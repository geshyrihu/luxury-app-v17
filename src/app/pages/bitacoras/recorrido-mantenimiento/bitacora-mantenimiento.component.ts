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
import CardEmployeeComponent from 'src/app/pages/directorios/employee-internal/card-employee.component';
import BitacoraMantenimientoFormComponent from './bitacora-mantenimiento-form.component';

@Component({
  selector: 'app-bitacora-mantenimiento',
  templateUrl: './bitacora-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class BitacoraMantenimientoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  dateS = inject(DateService);
  authServide = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  rangoCalendarioService = inject(FiltroCalendarService);

  customerList: any[] = [];

  fechaInicial: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  es: LocaleSettings;
  data: any[];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

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
    const urlApi = `BitacoraMantenimiento/GetAll/${this.customerIdS.customerId}/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onFilter() {
    this.onLoadData();
  }

  onDelete(item: any) {
    this.apiRequestS
      .onDelete(`BitacoraMantenimiento/${item.id}`)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  onModalFormBiacora(data: any) {
    this.dialogHandlerS
      .openDialog(
        BitacoraMantenimientoFormComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerS.dialogSizeMd
    );
  }
}
