import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ComponentsModule from 'app/shared/components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';
import { UserInfoDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-person',
  templateUrl: './addoredit-person.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],

  providers: [MessageService, CustomToastService],
})
export default class AddoreditPersonComponent implements OnInit, OnDestroy {
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

  public personId: number = 0;
  existingPerson: any;
  existingPhone: any;

  noImg = `${environment.base_urlImg}no-img.png`;
  imgBase64: string = '';

  imagen: File;
  dataError = '';
  data: UserInfoDto;
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    photoPath: [''],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      ],
    ],
  });

  onSubmit() {
    console.log('🚀 ~ this.form:', this.form.value);
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
    if (this.personId === 0) {
      this.subRef$ = this.dataService.post('Person', formData).subscribe({
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
    } else {
      this.subRef$ = this.dataService
        .put('person/' + this.personId, formData)
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
  }

  ngOnInit(): void {
    this.personId = this.config.data.personId;
    console.log('🚀 ~ this.personId:', this.personId);
    if (this.personId !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.subRef$ = this.dataService.get(`person/${this.personId}`).subscribe({
      next: (resp: any) => {
        this.form.patchValue(resp.body);
      },
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }
  get f() {
    return this.form.controls;
  }
  private createFormData(model: any): FormData {
    const formData = new FormData();

    formData.append('email', model.email);
    formData.append('firstName', model.firstName);
    formData.append('lastName', model.lastName);
    formData.append('phoneNumber', model.phoneNumber);
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
