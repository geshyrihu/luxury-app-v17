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

@Component({
  selector: 'app-employee-provider-addoredit',
  templateUrl: './employee-provider-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export class EmployeeProviderAddOrEditComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  imgBase64: string = '';
  typePerson: ETypePerson = this.config.data.typePerson;

  imagen: File;
  cb_profession: any[] = [];
  // dataError = '';
  data: UserInfoDto;
  form: FormGroup = this.formB.group({
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
    if (!this.apiRequestS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;
    var urlApi = '';
    if (this.typePerson == 0) {
      urlApi = 'Employees/CreateEmployee';
    } else {
      urlApi = 'Employees/CreateEmployeeExternal';
    }
    this.apiRequestS.onPost(urlApi, formData).then((responseData: boolean) => {
      responseData ? this.ref.close(true) : (this.submitting = false);
    });
  }

  ngOnInit(): void {
    this.apiRequestS.onGetSelectItem(`Professions`).then((response: any) => {
      this.cb_profession = response;
    });
  }

  get f() {
    return this.form.controls;
  }
  private createFormData(model: any): FormData {
    const formData = new FormData();

    formData.append('email', model.email);
    formData.append('customerId', String(this.customerIdS.getCustomerId()));
    formData.append('firstName', model.firstName);
    formData.append('birth', this.dateS.getDateFormat(model.birth));
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
    this.apiRequestS.onGetListNotLoading(urlApi).then((responseData: any) => {
      this.existingPerson = responseData;
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
    this.apiRequestS.onGetListNotLoading(urlApi).then((responseData: any) => {
      this.existingPhone = responseData;
    });
  }
}
