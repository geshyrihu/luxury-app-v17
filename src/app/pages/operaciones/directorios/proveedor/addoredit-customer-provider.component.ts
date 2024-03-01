import { Component, inject, type OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-add-or-edit-customer-provider',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, ReactiveFormsModule],

  templateUrl: './addoredit-customer-provider.component.html',
})
export default class AddOrEditCustomerProviderComponent implements OnInit {
  private customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);

  cb_providers: ISelectItemDto[] = [];
  cb_categories: ISelectItemDto[] = [];
  customerId: number = this.customerIdService.customerId;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: string = '';
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.onLoadSelectItem();
    this.onLoadForm();
  }
  onLoadData() {
    this.dataService
      .get(`customerprovider/getById/${this.config.data.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }

  // Controles de Formulario

  form: FormGroup;
  get f() {
    return this.form.controls;
  }
  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerId, Validators.required],
      providerId: ['', Validators.required],
      providerName: ['', Validators.required],
      categoryId: ['', Validators.required],
      categoryName: ['', Validators.required],
    });
  }

  onLoadSelectItem() {
    // Carga de listado de proveedores

    this.apiRequestService
      .onGetSelectItem(`providers`)
      .then((response: any) => {
        this.cb_providers = response;
      });

    // Carga de listado de categorias

    this.apiRequestService
      .onGetSelectItem(`categories`)
      .then((response: any) => {
        this.cb_categories = response;
      });
  }

  submit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === '') {
      this.dataService
        .post(`customerprovider`, this.form.value)
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
        .put(`customerprovider/${this.id}`, this.form.value)
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

  saveProviderId(e: any) {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
      providerName: find?.label,
    });
  }
  saveCategoryId(e: any) {
    let find = this.cb_categories.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      categoryId: find?.value,
      categoryName: find?.label,
    });
  }
}
export interface CustomerProviderAddOrEdit {
  customerId: number;
  providerId: number;
  categoryId: number;
}
