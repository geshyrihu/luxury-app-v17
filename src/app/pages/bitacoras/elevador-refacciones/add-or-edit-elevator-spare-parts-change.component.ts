import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-add-or-edit-elevator-spare-parts-change',
    templateUrl: './add-or-edit-elevator-spare-parts-change.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [DatePipe]
})
export default class AddOrEditElevatorSparePartsChangeComponent
  implements OnInit
{
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  datePipe = inject(DatePipe);
  dateS = inject(DateService);

  ref = inject(DynamicDialogRef);
  cb_elevators: ISelectItem[] = [];

  id: string = '';
  customerId: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    folio: [''],
    customerId: [this.config.data.customerId, Validators.required],
    machineryId: ['', Validators.required],
    changeDate: ['', Validators.required],
    failure: ['', Validators.required],
    partName: ['', Validators.required],
    partKey: ['', Validators.required],
    price: ['', Validators.required],
    supervised: ['', Validators.required],
  });

  ngOnInit(): void {
    this.onLoadDataElevators();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `elevatorsparepartschange/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      const changeDate = this.dateS.getDateFormat(responseData.changeDate);
      responseData.changeDate = changeDate;
      this.form.patchValue(responseData);
    });
  }
  onLoadDataElevators() {
    const urlApi = `elevatorsparepartschange/elevators/${this.config.data.customerId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.cb_elevators = responseData;
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    // Convertir la fecha a formato ISO 8601 utilizando DatePipe
    const formattedDate = this.datePipe.transform(
      this.form.value.changeDate,
      'yyyy-MM-dd'
    );
    // Asignar la fecha convertida de nuevo al formulario
    this.form.value.changeDate = formattedDate;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`elevatorsparepartschange`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`elevatorsparepartschange/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
