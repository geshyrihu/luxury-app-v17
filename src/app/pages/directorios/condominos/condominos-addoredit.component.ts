import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-condominos-addoredit',
    templateUrl: './condominos-addoredit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class CondominosAddOrEditComponent implements OnInit {
  enumSelectS = inject(EnumSelectService);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;
  customerId: number = this.customerIdS.customerId;
  cb_directory_condominium: any[] = [];
  cb_enviarMails: ISelectItem[] = [
    {
      label: 'Sí',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];
  cb_Habitant: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerId],
    phoneNumber: ['', Validators.required],
    directoryCondominiumId: ['', Validators.required],
    directoryCondominium: ['', Validators.required],
    extencion: [''],
    fixedPhone: [''],
    habitant: [null, Validators.required],
    email: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    enviarMails: [],
  });
  async ngOnInit() {
    this.customerId = this.customerIdS.customerId;

    this.apiRequestS
      .onGetSelectItem(
        `DirectoryCondominium/${this.customerIdS.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_directory_condominium = response;
      });

    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.getImem();
    }
    this.cb_Habitant = await this.enumSelectS.typeHabitant();
  }

  public savePropiedadId(e): void {
    let find = this.cb_directory_condominium.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      directoryCondominiumId: find?.value,
      directoryCondominium: find?.label,
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`ListCondomino`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`ListCondomino/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  getImem() {
    this.apiRequestS
      .onGetItem(`ListCondomino/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
        this.form.patchValue({
          directoryCondominium: responseData.directoryCondominium,
        });
      });
  }
}
