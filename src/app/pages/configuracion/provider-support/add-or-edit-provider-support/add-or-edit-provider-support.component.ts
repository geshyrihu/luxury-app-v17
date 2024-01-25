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
import { Subscription } from 'rxjs';
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
  subRef$: Subscription;

  cb_persons: ISelectItemDto[] = [];
  cb_professions: ISelectItemDto[] = [];
  cb_providers: ISelectItemDto[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    personId: ['', [Validators.required]],
    namePerson: ['', [Validators.required]],
    providerId: ['', [Validators.required]],
    nameProvider: ['', [Validators.required]],
    professionId: ['', [Validators.required]],
    nameProfession: ['', [Validators.required]],
  });

  ngOnInit() {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`providersupport/${this.id}`)
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
    console.log('🚀 ~ this.form.invalid:', this.form.value);
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === '') {
      this.subRef$ = this.dataService
        .post(`providersupport`, this.form.value)
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
      this.subRef$ = this.dataService
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
    this.selectItemService.onGetSelectItem('providers').subscribe((resp) => {
      this.cb_providers = resp;
      console.log('🚀 ~ this.cb_providers:', this.cb_providers);
    });
    // Carga de listado de categorias
    this.selectItemService.onGetSelectItem('professions').subscribe((resp) => {
      this.cb_professions = resp;
      console.log('🚀 ~ this.cb_professions:', this.cb_professions);
    });
    // Carga de listado de personas
    this.selectItemService.onGetSelectItem('persons').subscribe((resp) => {
      this.cb_persons = resp;
      console.log('🚀 ~ this.cb_persons:', this.cb_persons);
    });
  }

  saveProviderId(e: any) {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
      nameProvider: find?.label,
    });
    console.log('🚀 ~ this.form.invalid:', this.form.value);
  }
  saveProfessionsId(e: any) {
    let find = this.cb_professions.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
      nameProfession: find?.label,
    });
    console.log('🚀 ~ this.form.invalid:', this.form.value);
  }
  savePersonId(e: any) {
    let find = this.cb_persons.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      personId: find?.value,
      namePerson: find?.label,
    });
    console.log('🚀 ~ this.form.invalid:', this.form.value);
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
