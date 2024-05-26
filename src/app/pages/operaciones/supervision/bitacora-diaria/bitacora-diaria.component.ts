import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { environment } from 'src/environments/environment';
import AddOrEditBitacoraDiariaComponent from './addoredit-bitacora-diaria.component';
const base_url = environment.base_urlImg + 'Administration/accounts/';
@Component({
  selector: 'app-bitacora-diaria',
  templateUrl: './bitacora-diaria.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class BitacoraDiariaComponent implements OnInit, OnDestroy {
  dateService = inject(DateService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dialogService = inject(DialogService);
  rangoCalendarioService = inject(FiltroCalendarService);
  customToastService = inject(CustomToastService);

  loading: boolean = true;
  base_url = base_url;
  rangeDates: Date[] = [];
  ref: DynamicDialogRef;
  data: any[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_user: any[] = [];
  cb_customers: any[] = [];
  cb_estatus: any[] = ['Concluido', 'Pendiente'];

  //TODO: REVISAR SERVICIO FECHAS SERVICE
  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  personId = this.authService.personId;
  depto: string = 'SUPERVISIÓN DE OPERACIONES';
  nombre: string =
    this.authService.infoEmployeeDto.firstName +
    ' ' +
    this.authService.infoEmployeeDto.lastName;
  semana: string = this.fechaInicial + ' a ' + this.fechaFinal;

  ngOnInit(): void {
    this.onLoadUserSupervisor();

    this.apiRequestService
      .onGetSelectItem(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers = response.map((selectList: any) => ({
          label: selectList.label,
        }));
      });

    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `AgendaSupervision/GetAll/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onLoadUserSupervisor() {
    this.dataService
      .get('SelectItem/getlistsupervision')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_user = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditBitacoraDiariaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      width: '40%',
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`AgendaSupervision/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
