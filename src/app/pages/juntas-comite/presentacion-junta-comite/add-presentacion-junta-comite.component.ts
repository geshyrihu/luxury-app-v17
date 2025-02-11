import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-presentacion-junta-comite',
  templateUrl: './add-presentacion-junta-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
})
export default class AddPresentacionJuntaComiteComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';
  errorMessage: string = '';

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdS.getCustomerId()],
    fechaCorrespondiente: ['', Validators.required],
    fechaJunta: [''],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }
  onLoadData(id: number) {
    flatpickrFactory();

    const urlApi = `PresentacionJuntaComite/Get/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      result.fechaCorrespondiente = this.dateS.getDateFormat(
        result.fechaCorrespondiente
      );
      result.fechaJunta = this.dateS.getDateFormat(result.fechaJunta);
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`PresentacionJuntaComite/AddFecha`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`PresentacionJuntaComite/AddFecha/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
