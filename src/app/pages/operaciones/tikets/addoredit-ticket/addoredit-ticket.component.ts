import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EPriority } from 'src/app/core/enums/priority.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IFilterTicket } from 'src/app/core/interfaces/filter-ticket.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-addoredit-ticket',
  templateUrl: './addoredit-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
})
export default class AddoreditTicketComponent implements OnInit, OnDestroy {
  private customerSelectListService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  dataService = inject(DataService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_priority = onGetSelectItemFromEnum(EPriority);
  cb_area_responsable: any[] = [];
  cb_status = onGetSelectItemFromEnum(EStatusTask);
  cb_user_customers: any[] = [];
  form: FormGroup;
  id: any = 0;
  model: any;
  panelDto: IFilterTicket;
  photoAfterFileUpdate: boolean = false;
  photoBeforeFileUpdate: boolean = false;
  urlBaseImg = '';

  isInRoleMantenimiento = false;
  SuperUsuario = false;
  Colaborador: boolean = true;

  title: string = '';
  // Enviando...
  status: EStatusTask;

  tipoDePut: number = 0;
  statusFolio: any;
  submitting: boolean = false;
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.title = this.config.header;
    this.status = this.config.data.status;
    flatpickrFactory();
    this.urlBaseImg = `${
      environment.base_urlImg
    }customers/${this.customerSelectListService.getCustomerId()}/report/`;
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);

    this.loadForm();
  }

  public saveResponsableId(e: any): void {
    let find = this.cb_user_customers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeResponsableId: find?.value,
    });
  }
  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`ResponsibleArea`)
      .then((response: any) => {
        this.cb_area_responsable = response;
      });

    this.apiRequestService
      .onGetSelectItem(
        `GetUserCustomer/${this.customerSelectListService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_user_customers = response;
      });
  }
  loadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      activity: ['', Validators.required],
      dateFinished: [null],
      dateRequest: [this.dateService.getDateNow(), Validators.required],
      observations: [''],
      photoPathAfter: [''],
      photoPathBefore: [''],
      priority: [1, Validators.required],
      responsibleAreaId: [12, Validators.required],
      status: [this.status, Validators.required],
      customerId: [this.customerSelectListService.getCustomerId()],
      fechaProgamacion: [this.getFormattedDate(10), Validators.required],
      fechaLimite: [this.getFormattedDate(10), Validators.required],
      employeeResponsableId: ['', Validators.required],
      employeeResponsable: ['', Validators.required],
      employeeCargoReporte: [''],
      folioReporte: [true],
    });
  }

  getFormattedDate(daysToAdd: number): string {
    const date = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());
    const hour = this.pad(date.getHours());
    const minute = this.pad(date.getMinutes());
    const second = this.pad(date.getSeconds());
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  pad(number: number): string {
    if (number < 10) {
      return '0' + number;
    }
    return number.toString();
  }
  onLoadData(id: number) {
    this.dataService
      .get(`Ticket/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.model = resp.body;
          this.form.patchValue(resp.body);
          this.form.patchValue(resp.body);
          const contenidoHTML = this.form.get('activity').value;
          const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
          this.form.get('activity').patchValue(contenidoSinHTML);

          const contenidoHTML2 = this.form.get('observations').value;
          const contenidoSinHTML2 = contenidoHTML2.replace(
            /<[^>]*>|&nbsp;/g,
            ''
          );
          this.form.get('observations').patchValue(contenidoSinHTML2);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  validarImagen(model: any): string | null {
    if (model) {
      return this.urlBaseImg + model;
    } else {
      return null;
    }
  }
  onCerrarFolio(status: EStatusTask) {
    const model = this.createFormData(this.form.value);
    this.dataService
      .put(`Ticket/UpdateInfo/${this.id}`, model)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onticketConcluido(status, model);
          this.ref.close(true);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onticketConcluido(status: any, model: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .put(`Ticket/${this.id}/${status}`, model)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // Enviar por post un archivo adjunto

  // UpdateInfo
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model = this.createFormData(this.form.value);

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`Ticket/Create`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`Ticket/UpdateInfo/${this.id}`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }

  //Creación de FormData

  createFormData(dto: any) {
    const formData = new FormData();
    formData.append('dateRequest', String(dto.dateRequest));
    formData.append('activity', String(dto.activity));
    formData.append('observations', String(dto.observations));
    formData.append('status', String(dto.status));
    formData.append('priority', String(dto.priority));
    formData.append('customerId', String(dto.customerId));
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (dto.fechaProgamacion)
      formData.append(
        'fechaProgamacion',
        this.dateService.getDateFormat(dto.fechaProgamacion)
      );
    if (dto.fechaLimite)
      formData.append(
        'fechaLimite',
        this.dateService.getDateFormat(dto.fechaLimite)
      );
    if (dto.dateFinished)
      formData.append('dateFinished', String(dto.dateFinished));

    formData.append('employeeResponsableId', String(dto.employeeResponsableId));
    formData.append('folioReporte', dto.folioReporte);

    if (dto.photoPathAfter)
      formData.append('photoPathAfter', dto.photoPathAfter);

    if (dto.photoPathBefore)
      formData.append('photoPathBefore', dto.photoPathBefore);

    if (this.id != 0) {
      formData.append(
        'employeeCargoReporteId',
        String(dto.employeeCargoReporte)
      );
    } else {
      formData.append(
        'employeeCargoReporteId',
        String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
      );
    }

    return formData;
  }

  uploadFileAfter(file: File) {
    this.photoAfterFileUpdate = true;
    this.form.patchValue({ photoPathAfter: file });
  }
  uploadFileBefore(file: File) {
    this.photoBeforeFileUpdate = true;
    this.form.patchValue({ photoPathBefore: file });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
