import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ComponentsModule from 'app/shared/components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-provider-support',
  templateUrl: './add-or-edit-provider-support.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditProviderSupportComponent implements OnInit {
  private config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private selectItemService = inject(SelectItemService);

  submitting: boolean = false;
  id: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_persons: ISelectItemDto[] = [];
  cb_professions: ISelectItemDto[] = [];
  cb_providers: ISelectItemDto[] = [];
  cb_customers: ISelectItemDto[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    personId: ['', [Validators.required]],
    namePerson: ['', [Validators.required]],
    providerId: ['', [Validators.required]],
    nameProvider: ['', [Validators.required]],
    professionId: ['', [Validators.required]],
    nameProfession: ['', [Validators.required]],
    customerId: ['', [Validators.required]],
    nameCustomer: ['', [Validators.required]],
  });

  ngOnInit() {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`providersupport/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === '') {
      this.dataService
        .post(`providersupport`, this.form.value)
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
        .put(`providersupport/${this.id}`, this.form.value)
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

  onLoadSelectItem() {
    // Carga de listado de proveedores
    this.selectItemService
      .onGetSelectItem('providers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_providers = resp;
      });
    // Carga de listado de categorias
    this.selectItemService
      .onGetSelectItem('professions')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_professions = resp;
      });
    // Carga de listado de personas
    this.selectItemService
      .onGetSelectItem('persons')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_persons = resp;
      });
    // Carga de listado de clientes
    this.selectItemService
      .onGetSelectItem('customers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_customers = resp;
      });
  }

  saveProviderId(e: any) {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
      nameProvider: find?.label,
    });
  }
  saveProfessionsId(e: any) {
    let find = this.cb_professions.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
      nameProfession: find?.label,
    });
  }
  savePersonId(e: any) {
    let find = this.cb_persons.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      personId: find?.value,
      namePerson: find?.label,
    });
  }

  saveCustomerId(e: any) {
    let find = this.cb_customers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      customerId: find?.value,
      nameCustomer: find?.label,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
