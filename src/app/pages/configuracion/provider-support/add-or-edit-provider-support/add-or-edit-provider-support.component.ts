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
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private selectItemService = inject(SelectItemService);

  submitting: boolean = false;
  id: number = 0;
  subRef$: Subscription;

  cb_providers: ISelectItemDto[] = [];
  cb_professions: ISelectItemDto[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    firtName: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
      ,
    ],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    providerId: ['', [Validators.required]],
    nameProvider: ['', [Validators.required]],
    professionId: ['', [Validators.required]],
    nameProfession: ['', [Validators.required]],
  });

  ngOnInit() {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`providersupport/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
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

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`providersupport`, this.form.value)
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
        .put(`providersupport/${this.id}`, this.form.value)
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

  onLoadSelectItem() {
    // Carga de listado de proveedores
    this.selectItemService.onGetSelectItem('providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
    // Carga de listado de categorias
    this.selectItemService.onGetSelectItem('professions').subscribe((resp) => {
      this.cb_professions = resp;
    });
  }

  saveProviderId(e: any) {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
      providerName: find?.label,
    });
  }
  saveProfessionsId(e: any) {
    let find = this.cb_professions.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
      professionName: find?.label,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
