import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-status-request-salary-modification',
  templateUrl: './addoredit-status-request-salary-modification.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddOrEditStatusRequestSalaryModificationComponent
  implements OnInit
{
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  enumSelectS = inject(EnumSelectService);

  submitting: boolean = false;

  id: number = 0;

  cb_profession: ISelectItem[] = [];
  cb_si_no: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: { value: this.config.data.id, disabled: true },
    employeeId: ['', Validators.required],
    workPositionId: ['', Validators.required],
    requestDate: ['', Validators.required],
    soport: [''],
    professionCurrentId: ['', Validators.required],
    professionNewId: ['', Validators.required],
    currentSalary: ['', Validators.required],
    finalSalary: ['', Validators.required],
    executionDate: ['', Validators.required],
    folio: ['', Validators.required],
    retroactive: ['', Validators.required],
    status: [null, Validators.required],
    applicationUserId: ['', Validators.required],
    confirmationFinish: ['', Validators.required],
  });

  async ngOnInit() {
    this.cb_si_no = await this.enumSelectS.boolYesNo();
    this.onProfessionSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `RequestSalaryModification/GetById/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`RequestSalaryModification`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`RequestSalaryModification/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onProfessionSelectItem() {
    this.apiRequestS.onGetSelectItem(`Professions`).then((response: any) => {
      this.cb_profession = response;
    });
  }
}
