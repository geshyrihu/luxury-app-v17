import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETypePerson } from 'src/app/core/enums/type-person.enum';
import { imageToBase64 } from 'src/app/core/helpers/enumeration';
import { UserInfoDto } from 'src/app/core/interfaces/user-info.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-provider-add-or-edit',
  templateUrl: './employee-provider-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export class EmployeeProviderAddOrEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  noImg = `${environment.base_urlImg}no-img.png`;
  imgBase64: string = '';
  typePerson: ETypePerson = this.config.data.typePerson;

  imagen: File;
  cb_profession: any[] = [];
  // dataError = '';
  data: UserInfoDto;
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    professionId: ['', Validators.required],
    photoPath: ['', Validators.required],
    typePerson: [this.typePerson, Validators.required],
    birth: ['', Validators.required],
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
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;
    var urlApi = '';
    if (this.typePerson == 0) {
      urlApi = 'Employees/CreateEmployee';
    } else {
      urlApi = 'Employees/CreateEmployeeExternal';
    }
    this.apiRequestService.onPost(urlApi, formData).then((result: boolean) => {
      result ? this.ref.close(true) : (this.submitting = false);
    });
  }

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });
  }

  get f() {
    return this.form.controls;
  }
  private createFormData(model: any): FormData {
    const formData = new FormData();

    formData.append('email', model.email);
    formData.append(
      'customerId',
      String(this.customerIdService.getCustomerId())
    );
    formData.append('firstName', model.firstName);
    formData.append('birth', this.dateService.getDateFormat(model.birth));
    formData.append('lastName', model.lastName);
    formData.append('phoneNumber', model.phoneNumber);
    formData.append('professionId', model.professionId);
    formData.append('typePerson', this.typePerson.toString());

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
    if (fullName.target.value.length < 1) {
      return;
    }
    this.existingPerson = [];
    const urlApi = 'Employees/SearchExistingPerson/' + fullName.target.value;
    this.apiRequestService.onGetListNotLoading(urlApi).then((result: any) => {
      this.existingPerson = result;
    });
  }
  existingPerson: any;
  existingPhone: any;
  searchExistingPhone(phone: any) {
    if (phone.target.value.length < 1) {
      return;
    }

    this.existingPhone = [];

    const urlApi = 'Employees/SearchExistingPhone/' + phone.target.value;
    this.apiRequestService.onGetListNotLoading(urlApi).then((result: any) => {
      this.existingPhone = result;
    });
  }
}
