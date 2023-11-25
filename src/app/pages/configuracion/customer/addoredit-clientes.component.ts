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
import { ICustomerAddOrEditDto } from 'src/app/core/interfaces/ICustomerAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
  DateService,
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-clientes',
  templateUrl: './addoredit-clientes.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditClienteComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: any = 0;
  optionActive: ISelectItemDto[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];
  urlBaseImg = `${environment.base_urlImg}Administration/customer/`;
  model: ICustomerAddOrEditDto;
  photoFileUpdate: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    active: [true],
    adreess: ['', [Validators.required, Validators.minLength(10)]],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    nameCustomer: ['', [Validators.required, Validators.minLength(5)]],
    nombreCorto: ['', Validators.required],
    numeroCliente: ['', Validators.required],
    phoneOne: ['', Validators.required],
    phoneTwo: ['', Validators.required],
    photoPath: [''],
    register: [new Date(), Validators.required],
    rfc: ['', Validators.required],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get<ICustomerAddOrEditDto>(`Customers/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        const register = this.dateService.getDateFormat(resp.body.register);
        this.model.register = register;
        this.form.patchValue(this.model);
      });
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
        .post<ICustomerAddOrEditDto>('Customers', formData)
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
        .put<ICustomerAddOrEditDto>(`Customers/${this.id}`, formData)
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

  private createFormData(
    customerAdCustomerAddOrEdit: ICustomerAddOrEditDto
  ): FormData {
    const formData = new FormData();
    formData.append('active', String(customerAdCustomerAddOrEdit.active));
    formData.append('adreess', customerAdCustomerAddOrEdit.adreess);
    formData.append('nameCustomer', customerAdCustomerAddOrEdit.nameCustomer);
    formData.append('nombreCorto', customerAdCustomerAddOrEdit.nombreCorto);
    formData.append('phoneOne', customerAdCustomerAddOrEdit.phoneOne);
    formData.append('phoneTwo', customerAdCustomerAddOrEdit.phoneTwo);
    formData.append('longitud', customerAdCustomerAddOrEdit.longitud);
    formData.append('latitud', customerAdCustomerAddOrEdit.latitud);
    if (customerAdCustomerAddOrEdit.photoPath) {
      formData.append('photoPath', customerAdCustomerAddOrEdit.photoPath);
    }
    formData.append(
      'register',
      this.dateService.getDateFormat(customerAdCustomerAddOrEdit.register)
    );
    formData.append('rfc', customerAdCustomerAddOrEdit.rfc);
    formData.append('numeroCliente', customerAdCustomerAddOrEdit.numeroCliente);
    return formData;
  }
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
