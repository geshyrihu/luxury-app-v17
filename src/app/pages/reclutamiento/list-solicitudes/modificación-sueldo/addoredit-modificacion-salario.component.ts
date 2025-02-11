import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-modificacion-salario',
  templateUrl: './addoredit-modificacion-salario.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddoreditModificacionSalarioComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  submitting: boolean = false;

  cb_status: ISelectItem[] = [];
  cb_si_no: ISelectItem[] = [];
  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    applicationUserId: [, Validators.required],
    confirmationFinish: [, Validators.required],
    currentSalary: [, Validators.required],
    employeeId: [, Validators.required],
    executionDate: [, Validators.required],
    finalSalary: [, Validators.required],
    folio: [, Validators.required],
    professionCurrentId: [, Validators.required],
    professionNewId: [, Validators.required],
    requestDate: [, Validators.required],
    retroactive: [false, Validators.required],
    soport: [],
    status: [null, Validators.required],
    workPositionId: [, Validators.required],
  });

  async ngOnInit() {
    this.cb_si_no = await this.enumSelectS.boolYesNo();
    this.cb_status = await this.enumSelectS.status();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `requestsalarymodification/getbyid/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.id = this.config.data.id;

    this.submitting = true;

    this.apiRequestS
      .onPut(`requestsalarymodification/${this.id}`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
