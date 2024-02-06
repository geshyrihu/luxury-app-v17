import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EState } from 'src/app/core/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-herramienta',
  templateUrl: './addoredit-herramienta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
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
  public apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.selectItemService
      .onGetSelectItem('Categories')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_category = resp;
      });
  }
  onLoadData() {
    this.dataService
      .get(`Tools/Get/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
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
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formDataDto = this.onCreateFormData(this.form.value);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post('Tools', formDataDto)
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
        .put(`Tools/${this.id}`, formDataDto)
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
