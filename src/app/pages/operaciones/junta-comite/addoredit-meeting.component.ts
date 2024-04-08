import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETypeMeeting } from 'src/app/core/enums/type-meeting.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMeeting } from '../../../core/interfaces/meeting.interface';
import AddOrEditListAdministrationComponent from './addoredit-administration/addoredit-list-administration.component';
import AddOrEditComiteComponent from './addoredit-comite/addoredit-comite.component';
import AddOrEditInvitedComponent from './addoredit-invitado/addoredit-invited.component';

const date = new Date();
@Component({
  selector: 'app-addoredit-meeting',
  templateUrl: './addoredit-meeting.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    AddOrEditComiteComponent,
    AddOrEditListAdministrationComponent,
    AddOrEditInvitedComponent,
  ],
})
export default class AddOrEditMeetingComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  formBuilder = inject(FormBuilder);

  dateNow = new Date(
    date.getTime() + new Date().getTimezoneOffset() * -60 * 1000
  )
    .toISOString()
    .slice(0, 19);
  id: any = 0;
  idNew: number;
  customerId: number;
  participantInvitado: any[] = [];
  cb_typeMeeting: ISelectItem[] = onGetSelectItemFromEnum(ETypeMeeting);
  form: FormGroup;

  ngOnInit() {
    flatpickrFactory();
    this.customerId = this.config.data.customerId;

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      date: [this.dateNow, Validators.required],
      eTypeMeeting: ['', Validators.required],
      customerId: [this.customerId],
      user: [null],
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model: IMeeting = this.form.value;

    if (this.id === 0) {
      this.apiRequestService.onPost(`Meetings`, model).then((result: any) => {
        this.id = result.id;
        this.onLoadData();
      });
    } else {
      this.apiRequestService
        .onPut(`Meetings/${this.id}`, model)
        .then((result: any) => {
          this.onLoadData();
        });
    }
  }

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    const urlApi = `Meetings/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
}
