import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IRadioComunicacionAddOrEdit } from 'src/app/core/interfaces/radio-comunicacion-add-or-edit.interface';
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
  selector: 'app-addoredit-radio-comunicacion',
  templateUrl: './addoredit-radio-comunicacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditRadioComunicacionComponent implements OnInit {
  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  model: IRadioComunicacionAddOrEdit;
  photoFileUpdate: boolean = false;
  cb_person: ISelectItem[] = [];
  cb_area_responsable: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    marca: ['', Validators.required],
    fotografia: [''],
    modelo: ['', Validators.required],
    serie: ['', Validators.required],
    fechaCompra: ['', Validators.required],
    customerId: [],
    bateria: ['', Validators.required],
    responsibleAreaId: [0, Validators.required],
    responsibleAreaName: [''],
    applicationUserId: [null],
    applicationUser: [''],
  });

  onLoadData() {
    const urlApi = `RadioComunicacion/${this.id}`;
    this.apiRequestService
      .onGetItem<IRadioComunicacionAddOrEdit>(urlApi)
      .then((result: IRadioComunicacionAddOrEdit) => {
        this.urlBaseImg = `${environment.base_urlImg}customers/${result.customerId}/radios/${result.fotografia}`;

        this.form.patchValue(result);
      });
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ fotografia: file });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post('RadioComunicacion', formData)
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
        .put(`RadioComunicacion/${this.id}`, formData)
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

  public saveAreResponsableId(e: any): void {
    let find = this.cb_area_responsable.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      responsibleAreaId: find?.value,
    });
  }
  public savepersonId(e: any): void {
    let find = this.cb_person.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      applicationUserId: find?.value,
    });
  }

  private createFormData(dto: IRadioComunicacionAddOrEdit): FormData {
    const formData = new FormData();
    formData.append('marca', dto.marca);
    formData.append('modelo', dto.modelo);
    formData.append('serie', dto.serie);
    formData.append(
      'fechaCompra',
      this.dateService.getDateFormat(dto.fechaCompra)
    );
    formData.append('bateria', dto.bateria);

    if (this.id == 0) {
      formData.append('customerId', String(this.customerIdService.customerId));
    } else {
      formData.append('customerId', String(dto.customerId));
    }
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));

    if (dto.applicationUserId != null) {
      formData.append('applicationUserId', String(dto.applicationUserId));
    }

    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.fotografia) {
      formData.append('fotografia', dto.fotografia);
    }
    return formData;
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(
        `ApplicationUser/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_person = response;
      });

    this.apiRequestService
      .onGetSelectItem(`ResponsibleArea`)
      .then((response: any) => {
        this.cb_area_responsable = response;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
