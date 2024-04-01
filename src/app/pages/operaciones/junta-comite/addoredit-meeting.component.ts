import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ETypeMeeting } from 'src/app/core/enums/type-meeting.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
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
export default class AddOrEditMeetingComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  public messageService = inject(MessageService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    else {
      const model: IMeeting = this.form.value;

      if (this.id !== 0) {
        // Mostrar un mensaje de carga
        this.customToastService.onLoading();
        this.dataService
          .put(`Meetings/${this.id}`, model)
          .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
          .subscribe({
            next: () => {
              this.onLoadData();
              this.customToastService.onClose();
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      } else {
        // Mostrar un mensaje de carga
        this.customToastService.onLoading();
        this.dataService
          .post(`Meetings`, model)
          .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
          .subscribe({
            next: (resp: any) => {
              this.id = resp.body.id;
              this.onLoadData();
              this.customToastService.onClose();
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      }
    }
  }

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    this.dataService
      .get(`Meetings/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
