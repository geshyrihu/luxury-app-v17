import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EPriority } from 'src/app/core/enums/priority.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IFilterTicket } from 'src/app/core/interfaces/filter-ticket.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
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
export default class AddoreditTicketComponent implements OnInit {
  customerIdService = inject(CustomerIdService);

  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  dateService = inject(DateService);
  authS = inject(AuthService);

  cb_priority = onGetSelectItemFromEnum(EPriority);
  cb_status = onGetSelectItemFromEnum(EStatusTask);
  cb_user_customers: ISelectItem[] = [];
  cb_departments: ISelectItem[] = [];

  id: any = 0;
  model: any;
  panelDto: IFilterTicket;
  photoAfterFileUpdate: boolean = false;
  photoBeforeFileUpdate: boolean = false;
  urlBaseImg = '';

  isInRoleMantenimiento = false;
  SuperUsuario = false;
  Colaborador: boolean = true;

  tipoDePut: number = 0;
  statusFolio: any;
  submitting: boolean = false;

  form: FormGroup;
  loadForm(): void {
    this.form = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      photoPathBefore: [''],
      photoPathAfter: [''],
      activity: ['', [Validators.required, Validators.minLength(1)]],
      observations: [''],
      status: [this.config.data.status, Validators.required],
      priority: [1, Validators.required],
      departament: [this.config.data.departament, Validators.required],
      customerId: [this.customerIdService.customerId, Validators.required],
      fechaProgamacion: [null],
      dateFinished: [null],
      applicationUserCargoReporteId: [''],
      applicationUserResponsable: [''],
      applicationUserResponsableId: [this.authS.applicationUserId],
    });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.urlBaseImg = this.onCreatePathImg();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.loadForm();
  }

  onCreatePathImg(): string {
    return `${
      environment.base_urlImg
    }customers/${this.customerIdService.getCustomerId()}/report/`;
  }

  saveResponsableId(e: any): void {
    let find = this.cb_user_customers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      applicationUserResponsableId: find?.value,
    });
  }
  onLoadSelectItem() {
    flatpickrFactory();

    const urlApi = `EnumSelect/Departament`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_departments = result;
    });

    const urlApi2 = `UserFromCustomer/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetSelectItem(urlApi2).then((response: any) => {
      this.cb_user_customers = response;
    });
  }

  pad(number: number): string {
    if (number < 10) {
      return '0' + number;
    }
    return number.toString();
  }
  onLoadData() {
    const urlApi = `Tickets/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.model = result;
      this.form.patchValue(result);
      const contenidoHTML = this.form.get('activity').value;
      const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
      this.form.get('activity').patchValue(contenidoSinHTML);

      const contenidoHTML2 = this.form.get('observations').value;
      const contenidoSinHTML2 = contenidoHTML2.replace(/<[^>]*>|&nbsp;/g, '');
      this.form.get('observations').patchValue(contenidoSinHTML2);
    });
  }

  validarImagen(model: any): string | null {
    if (model) {
      return this.urlBaseImg + model;
    } else {
      return null;
    }
  }

  // UpdateInfo
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Tickets`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Tickets/${this.id}`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  //Creación de FormData

  createFormData(dto: any) {
    const formData = new FormData();

    if (dto.photoPathAfter) {
      formData.append('photoPathAfter', dto.photoPathAfter);
    }

    if (dto.photoPathBefore) {
      formData.append('photoPathBefore', dto.photoPathBefore);
    }

    formData.append('activity', String(dto.activity));
    formData.append('observations', String(dto.observations));
    formData.append('status', String(dto.status));
    formData.append('priority', String(dto.priority));
    formData.append('departament', String(dto.departament));
    formData.append('customerId', String(dto.customerId));
    if (dto.fechaProgamacion)
      formData.append(
        'fechaProgamacion',
        this.dateService.getDateFormat(dto.fechaProgamacion)
      );
    if (dto.dateFinished)
      formData.append(
        'dateFinished',
        this.dateService.getDateFormat(dto.dateFinished)
      );

    formData.append(
      'applicationUserResponsableId',
      String(dto.applicationUserResponsableId)
    );

    if (this.id != 0) {
      formData.append(
        'applicationUserCargoReporteId',
        String(dto.applicationUserCargoReporteId)
      );
    } else {
      formData.append(
        'applicationUserCargoReporteId',
        String(this.authS.applicationUserId)
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
}
