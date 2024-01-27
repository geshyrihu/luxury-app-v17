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
import { Subject, takeUntil } from 'rxjs';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';
import { UserInfoDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';
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

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  noImg = `${environment.base_urlImg}no-img.png`;
  imgBase64: string = '';

  imagen: File;
  cb_profession: any[] = [];
  // dataError = '';
  data: UserInfoDto;
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birth: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    professionId: ['', Validators.required],
    photoPath: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      ],
    ],
  });
  register() {
    if (!this.dataService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post('Employees/CreateEmployee', formData)
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

  ngOnInit(): void {
    this.selectItemService
      .onGetSelectItem('Professions')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
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
    this.dataService
      .get('Employees/SearchExistingPerson/' + fullName.target.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp) => {
          this.existingPerson = resp.body;
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }
  existingPerson: any;
  existingPhone: any;
  searchExistingPhone(phone: any) {
    this.existingPhone = [];
    this.dataService
      .get('Employees/SearchExistingPhone/' + phone.target.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp) => {
          this.existingPhone = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
