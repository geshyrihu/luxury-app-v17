import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IRadioComunicacionAddOrEditDto } from 'src/app/core/interfaces/IRadioComunicacionAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
} from 'src/app/core/services/common-services';
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
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  model: IRadioComunicacionAddOrEditDto;
  photoFileUpdate: boolean = false;
  userId = '';
  cb_employee: ISelectItemDto[] = [];
  cb_area_responsable: ISelectItemDto[] = [];
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
    employeeId: [null],
    employeeName: [''],
  });

  onLoadData() {
    this.dataService
      .get<IRadioComunicacionAddOrEditDto>(`RadioComunicacion/${this.id}`)
      .subscribe((resp) => {
        this.urlBaseImg = `${environment.base_urlImg}customers/${resp.body.customerId}/radios/${resp.body.fotografia}`;
        this.form.patchValue(resp.body);
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
    // Deshabilitar el botón al iniciar el envío del formulario
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
  public saveEmployeeId(e: any): void {
    let find = this.cb_employee.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeId: find?.value,
    });
  }

  private createFormData(dto: IRadioComunicacionAddOrEditDto): FormData {
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

    if (dto.employeeId != null) {
      formData.append('employeeId', String(dto.employeeId));
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
        `EmployeeActivo/${this.customerIdService.getcustomerId()}`
      )
      .then((response: any) => {
        this.cb_employee = response;
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
