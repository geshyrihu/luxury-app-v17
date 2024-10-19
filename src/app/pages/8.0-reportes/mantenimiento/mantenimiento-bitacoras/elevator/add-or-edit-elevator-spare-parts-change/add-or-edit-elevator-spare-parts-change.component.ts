import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { ISelectItem } from '../../../../../../core/interfaces/select-Item.interface';

@Component({
  selector: 'app-add-or-edit-elevator-spare-parts-change',
  templateUrl: './add-or-edit-elevator-spare-parts-change.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [DatePipe],
})
export default class AddOrEditElevatorSparePartsChangeComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  datePipe = inject(DatePipe);
  dateService = inject(DateService);

  ref = inject(DynamicDialogRef);
  cb_elevators: ISelectItem[] = [];

  id: string = '';
  customerId: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
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
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      const changeDate = this.dateService.getDateFormat(result.changeDate);
      result.changeDate = changeDate;
      this.form.patchValue(result);
    });
  }
  onLoadDataElevators() {
    const urlApi = `elevatorsparepartschange/elevators/${this.config.data.customerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.cb_elevators = result;
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    // Convertir la fecha a formato ISO 8601 utilizando DatePipe
    const formattedDate = this.datePipe.transform(
      this.form.value.changeDate,
      'yyyy-MM-dd'
    );
    // Asignar la fecha convertida de nuevo al formulario
    this.form.value.changeDate = formattedDate;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`elevatorsparepartschange`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`elevatorsparepartschange/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
