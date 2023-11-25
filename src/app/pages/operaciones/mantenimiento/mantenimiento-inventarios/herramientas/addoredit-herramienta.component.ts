import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EState } from 'src/app/core/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
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
  selector: 'app-addoredit-herramienta',
  templateUrl: './addoredit-herramienta.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
})
export default class AddoreditToolsComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public dateService = inject(DateService);
  public selectItemService = inject(SelectItemService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;
  urlBaseImg = '';
  file: File;
  model: any;
  photoFileUpdate: boolean = false;

  cb_category: any[] = [{}];
  optionActive: ISelectItemDto[] = onGetSelectItemFromEnum(EState);
  form: FormGroup;

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      nameTool: ['', [Validators.required, Validators.minLength(5)]],
      brand: ['', [Validators.required]],
      serie: [''],
      model: [''],
      photoPath: [''],
      state: [0, [Validators.required]],
      dateOfPurchase: [this.dateService.getDateNow(), [Validators.required]],
      technicalSpecifications: [''],
      observations: [''],
      categoryId: ['', [Validators.required]],
      employeeId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        [Validators.required],
      ],
      customerId: [this.customerIdService.getcustomerId()],
    });
  }

  onLoadSelectItem() {
    this.selectItemService.onGetSelectItem('Categories').subscribe((resp) => {
      this.cb_category = resp;
    });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Tools/Get/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        resp.body.dateOfPurchase = this.dateService.getDateFormat(
          resp.body.dateOfPurchase
        );
        this.urlBaseImg = `${
          environment.base_urlImg
        }customers/${this.customerIdService.getcustomerId()}/tools/${
          this.model.photoPath
        }`;
        this.form.patchValue(resp.body);
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const formDataDto = this.onCreateFormData(this.form.value);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService.post('Tools', formDataDto).subscribe({
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
        .put(`Tools/${this.id}`, formDataDto)
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
    this.submitting = false;
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();

    formData.append('nameTool', dto.nameTool);
    formData.append('brand', dto.brand);
    formData.append('serie', dto.serie);
    formData.append('model', dto.model);
    formData.append('state', String(dto.state));
    formData.append(
      'dateOfPurchase',
      this.dateService.getDateFormat(dto.dateOfPurchase)
    );
    formData.append('technicalSpecifications', dto.technicalSpecifications);
    formData.append('observations', dto.observations);
    formData.append('categoryId', String(dto.categoryId));
    formData.append(
      'employeeId',
      String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
    );
    formData.append('customerId', String(dto.customerId));
    if (dto.photoPath) {
      formData.append('photoPath', dto.photoPath);
    }

    return formData;
  }
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
