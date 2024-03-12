import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
  DateService,
  FiltroCalendarService,
} from 'src/app/core/services/common-services';

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
  private dateService = inject(DateService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private dialogService = inject(DialogService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  private customToastService = inject(CustomToastService);

  loading: boolean = true;
  base_url = base_url;
  rangeDates: Date[] = [];
  ref: DynamicDialogRef;
  data: any[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_user: any[] = [];
  cb_customers: any[] = [];
  cb_estatus: any[] = ['Concluido', 'Pendiente'];

  //TODO: REVISAR SERVICIO FECHASSERVICE
  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  employeeId = this.authService.infoEmployeeDto.employeeId;
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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`AgendaSupervision/GetAll/${this.fechaInicial}/${this.fechaFinal}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
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
