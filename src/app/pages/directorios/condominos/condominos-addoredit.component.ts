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
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class CondominosAddOrEditComponent implements OnInit {
  enumSelectService = inject(EnumSelectService);
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;
  customerId: number = this.custIdService.customerId;
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
  form: FormGroup = this.formBuilder.group({
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
    this.customerId = this.custIdService.customerId;

    this.apiRequestService
      .onGetSelectItem(
        `DirectoryCondominium/${this.custIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_directory_condominium = response;
      });

    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.getImem();
    }
    this.cb_Habitant = await this.enumSelectService.typeHabitant();
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
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`ListCondomino`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`ListCondomino/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  getImem() {
    this.apiRequestService
      .onGetItem(`ListCondomino/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          directoryCondominium: result.directoryCondominium,
        });
      });
  }
}
