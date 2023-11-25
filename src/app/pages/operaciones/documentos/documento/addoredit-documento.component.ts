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
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-documento',
  templateUrl: './addoredit-documento.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditDocumentoComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private serviceIdCustomer = inject(CustomerIdService);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;
  checked: boolean = false;
  cb_categoriaDocumento: boolean = true;
  urlBaseImg = environment.base_urlImg;
  model: any;
  filteredProvider: any[];
  selectedProvider: any;
  file: File;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.serviceIdCustomer.getcustomerId(), Validators.required],
    document: ['', Validators.required],
    categoriaDocumento: [true, Validators.required],
    nameDocument: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.onLoadData();
    }
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`DocumentoCustomer/${this.id}`)
      .subscribe((resp: any) => {
        this.id = resp.body.id;
        this.form.patchValue(resp.body);
      });
  }
  submit() {
    let formData = this.createModel(this.form);

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
        .post(`DocumentoCustomer`, formData)
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
        .put(`DocumentoCustomer/${this.id}`, formData)
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

  uploadFile(event) {
    this.file = event.target.files[0];
  }
  createModel(form: FormGroup): FormData {
    const formData = new FormData();
    if (this.file !== undefined) {
      formData.append('document', this.file);
    }
    formData.append('nameDocument', String(form.get('nameDocument').value));
    formData.append('customerId', String(form.get('customerId').value));
    formData.append(
      'categoriaDocumento',
      String(form.get('categoriaDocumento').value)
    );
    return formData;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }

  get f() {
    return this.form.controls;
  }
}
