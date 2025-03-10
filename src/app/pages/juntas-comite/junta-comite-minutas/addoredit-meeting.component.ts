import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import AddOrEditComiteComponent from './addoredit-comite.component';
import AddOrEditInvitedComponent from './addoredit-invited.component';
import AddOrEditListAdministrationComponent from './addoredit-list-administration.component';

const date = new Date();

@Component({
    selector: 'app-addoredit-meeting',
    templateUrl: './addoredit-meeting.component.html',
    imports: [
        LuxuryAppComponentsModule,
        AddOrEditComiteComponent,
        AddOrEditListAdministrationComponent,
        AddOrEditInvitedComponent,
        CustomInputModule,
    ],
    providers: [EnumSelectService]
})
export default class AddOrEditMeetingComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  dateNow = new Date(
    date.getTime() + new Date().getTimezoneOffset() * -60 * 1000
  )
    .toISOString()
    .slice(0, 19);
  id: any = 0;
  idNew: number;
  customerId: number;
  participantInvitado: any[] = [];
  cb_typeMeeting: ISelectItem[] = [];
  form: FormGroup;

  async ngOnInit() {
    this.cb_typeMeeting = await this.enumSelectS.typeMeeting();
    flatpickrFactory();
    this.customerId = this.config.data.customerId;

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      date: [this.dateNow, Validators.required],
      eTypeMeeting: [null, Validators.required],
      customerId: [this.customerId],
      applicationUserId: [this.authS.applicationUserId],
    });
  }

  constructor(private formB: FormBuilder) {
    this.form = this.formB.group({
      id: { value: null, disabled: true },
      date: [null, Validators.required],
      eTypeMeeting: [null, Validators.required],
      customerId: [null],
      applicationUserId: [null],
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Meetings`, this.form.value)
        .then((responseData: any) => {
          this.id = responseData.id;
          this.onLoadData();
        });
    } else {
      this.apiRequestS
        .onPut(`Meetings/${this.id}`, this.form.value)
        .then((responseData: any) => {
          this.onLoadData();
        });
    }
  }

  onLoadData() {
    const urlApi = `Meetings/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
}
