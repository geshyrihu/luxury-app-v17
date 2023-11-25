import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';
import { UserInfoDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-account-customer',
  templateUrl: './add-account-customer.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],

  providers: [MessageService, CustomToastService],
})
export default class AddAccountCustomerComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public selectItemService = inject(SelectItemService);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  subRef$: Subscription;

  noImg = `${environment.base_urlImg}no-img.png`;
  imgBase64: string = '';

  imagen: File;
  cb_profession: any[] = [];
  dataError = '';
  data: UserInfoDto;
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birth: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    professionId: ['', Validators.required],
    photoPath: ['', Validators.required],
    email: ['', [Validators.required]],
  });
  register() {
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

    this.subRef$ = this.dataService
      .post('Employees/CreateEmployee', formData)
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          err.error.forEach((x) => {
            this.dataError = this.dataError + x['description'] + ' ';
          });
          this.customToastService.onLoadingError(this.dataError);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onClose();
        },
      });
  }

  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
  }

  get f() {
    return this.form.controls;
  }
  private createFormData(model: any): FormData {
    const formData = new FormData();

    formData.append('birth', this.dateService.getDateFormat(model.birth));
    formData.append('email', model.email);
    formData.append(
      'customerId',
      String(this.customerIdService.getcustomerId())
    );
    formData.append('firstName', model.firstName);
    formData.append('lastName', model.lastName);
    formData.append('phoneNumber', model.phoneNumber);
    formData.append('professionId', model.professionId);

    if (this.imagen) {
      formData.append('photoPath', this.imagen);
    }

    return formData;
  }

  change(event: any): void {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      imageToBase64(file)
        .then((value: string) => {
          this.imgBase64 = value;
        })
        .catch((error) => console.log(error));
      this.imagen = file;
    }
  }

  searchExistingPerson(fullName: any) {
    this.existingPerson = [];
    this.subRef$ = this.dataService
      .get('Employees/SearchExistingPerson/' + fullName.target.value)
      .subscribe({
        next: (resp) => {
          this.existingPerson = resp.body;
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
  existingPerson: any;
  existingPhone: any;
  searchExistingPhone(phone: any) {
    this.existingPhone = [];
    this.subRef$ = this.dataService
      .get('Employees/SearchExistingPhone/' + phone.target.value)
      .subscribe({
        next: (resp) => {
          this.existingPhone = resp.body;
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
