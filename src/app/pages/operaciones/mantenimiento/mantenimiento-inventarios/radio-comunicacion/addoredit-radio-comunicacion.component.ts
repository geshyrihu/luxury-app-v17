import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IRadioComunicacionAddOrEditDto } from 'src/app/core/interfaces/IRadioComunicacionAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-radio-comunicacion',
  templateUrl: './addoredit-radio-comunicacion.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
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
  public selectItemService = inject(SelectItemService);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post('RadioComunicacion', formData)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`RadioComunicacion/${this.id}`, formData)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
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
    this.selectItemService
      .onGetSelectItem(
        `EmployeeActivo/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp) => {
        this.cb_employee = resp;
      });

    this.selectItemService
      .onGetSelectItem('ResponsibleArea')
      .subscribe((resp) => {
        this.cb_area_responsable = resp;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
