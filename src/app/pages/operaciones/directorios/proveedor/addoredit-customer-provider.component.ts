import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-customer-provider',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonModule,
    CustomInputModule,
    ReactiveFormsModule,
  ],
  providers: [CustomToastService],
  templateUrl: './addoredit-customer-provider.component.html',
})
export default class AddOrEditCustomerProviderComponent implements OnInit {
  private customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  cb_providers: ISelectItemDto[] = [];
  cb_categories: ISelectItemDto[] = [];
  customerId: number = this.customerIdService.customerId;
  subRef$: Subscription;
  submitting: boolean = false;

  id: string = '';
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.onLoadSelectItem();
    this.onLoadForm();
  }
  onLoadData() {
    this.subRef$ = this.dataService
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
    this.selectItemService.onGetSelectItem('providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
    // Carga de listado de categorias
    this.selectItemService.onGetSelectItem('categories').subscribe((resp) => {
      this.cb_categories = resp;
    });
  }

  submit() {
    console.log('object', this.form.value);
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === '') {
      this.subRef$ = this.dataService
        .post(`customerprovider`, this.form.value)
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
        .put(`customerprovider/${this.id}`, this.form.value)
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