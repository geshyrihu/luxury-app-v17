import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EPriority } from 'src/app/core/enums/priority.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-addoredit-sistemas-reporte',
  templateUrl: './addoredit-sistemas-reporte.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditSistemasReporteComponent
  implements OnInit, OnDestroy
{
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dateService = inject(DateService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: any = 0;

  //TODOñ REVISAR ESTE CustomerId
  _customerId: number = 0;
  cb_status = onGetSelectItemFromEnum(EStatusTask);
  cb_priority: ISelectItem[] = onGetSelectItemFromEnum(EPriority);
  cb_area_responsable: any[] = [];
  cb_user: any[] = [];
  cb_responsableSistemas: any[] = [];
  form: FormGroup;
  photoAfterFileUpdate: boolean = false;
  photoBeforeFileUpdate: boolean = false;
  urlBaseImg = '';
  model: any;

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.loadData(this.id);
    }
    this.loadForm(this.config.data.status);
  }

  public saveUserId(e: any): void {
    let find = this.cb_user.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeCargoReporteId: find?.value,
    });
  }
  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`ResponsibleArea`)
      .then((response: any) => {
        this.cb_area_responsable = response;
      });

    this.onLoadApplicationUser();

    this.apiRequestService
      .onGetSelectItem(`responsableSistemas`)
      .then((response: any) => {
        this.cb_responsableSistemas = response;
      });
  }

  loadForm(status: number) {
    let dateFinal: any;
    if (this.config.data.status === 1) {
      dateFinal = new Date();
    }

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      activity: ['', Validators.required],
      dateFinished: [],
      dateRequest: [this.dateService.getDateNow(), Validators.required],
      observations: [''],
      photoPathAfter: [''],
      photoPathBefore: [''],
      priority: [0, Validators.required],
      responsibleAreaId: [13],
      status: [0, Validators.required],
      employeeResponsableId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        Validators.required,
      ],
      employeeCargoReporteId: ['', Validators.required],
      userName: ['', Validators.required],
    });
  }

  loadData(id: number) {
    this.dataService
      .get(`Ticket/FromSistemas/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.form.patchValue(resp.body);
        this.urlBaseImg = `${environment.base_urlImg}customers/${this.model.customerId}/report/`;
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model = this.createFormData(this.form.value);

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`Ticket/CreateFromSistemas`, model)
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
        .put(`Ticket/FromSistemas/${this.id}`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }

  createFormData(dto: any) {
    const formData = new FormData();
    if (dto.status === 1) {
      dto.dateFinished = new Date().toUTCString();
    }
    formData.append(
      'dateRequest',
      this.dateService.getDateFormat(dto.dateRequest)
    );
    formData.append('activity', dto.activity);
    formData.append('observations', dto.observations);
    formData.append('status', String(dto.status));
    formData.append('priority', String(dto.priority));
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (dto.dateFinished !== null)
      formData.append('dateFinished', String(dto.dateFinished));
    if (dto.photoPathAfter) {
      formData.append('photoPathAfter', dto.photoPathAfter);
    }
    if (dto.photoPathBefore) {
      formData.append('photoPathBefore', dto.photoPathBefore);
    }
    formData.append('employeeCargoReporteId', dto.employeeCargoReporteId);
    formData.append('employeeResponsableId', dto.employeeResponsableId);

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

  onLoadApplicationUser() {
    this.dataService
      .get('SelectItem/AplicationUser/')
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
