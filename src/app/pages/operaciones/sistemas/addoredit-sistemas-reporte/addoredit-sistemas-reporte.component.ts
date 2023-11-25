import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EPriority } from 'src/app/core/enums/priority.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-addoredit-sistemas-reporte',
  templateUrl: './addoredit-sistemas-reporte.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditSistemasReporteComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private selectItemService = inject(SelectItemService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private dateService = inject(DateService);
  private customToastService = inject(CustomToastService);
  private enumService = inject(EnumService);

  submitting: boolean = false;

  id: any = 0;

  subRef$: Subscription;

  //TODOñ REVISAR ESTE CustomerId
  _customerId: number = 0;
  cb_status = onGetSelectItemFromEnum(EStatusTask);
  cb_priority: ISelectItemDto[] = onGetSelectItemFromEnum(EPriority);
  cb_area_responsable: any[] = [];
  cb_user: any[] = [];
  cb_responsableSistemas: any[] = [];
  form: FormGroup;
  photoAfterFileUpdate: boolean = false;
  photoBeforeFileUpdate: boolean = false;
  urlBaseImg = '';
  model: any;

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.loadData(this.id);
    }
    this.loadForm(this.config.data.status);
  }

  public saveUserId(e: any): void {
    let find = this.cb_user.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeCargoReporteId: find?.value,
    });
  }
  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('ResponsibleArea')
      .subscribe((resp) => {
        this.cb_area_responsable = resp;
      });
    this.onLoadApplicationUser();

    this.selectItemService
      .onGetSelectItem('responsableSistemas')
      .subscribe((resp) => {
        this.cb_responsableSistemas = resp;
      });
  }

  loadForm(status: number) {
    let dateFinal: any;
    if (this.config.data.status === 1) {
      dateFinal = new Date();
    }

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      activity: ['', Validators.required],
      dateFinished: [],
      dateRequest: [this.dateService.getDateNow(), Validators.required],
      observations: [''],
      photoPathAfter: [''],
      photoPathBefore: [''],
      priority: [0, Validators.required],
      responsibleAreaId: [13],
      status: [0, Validators.required],
      employeeResponsableId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        Validators.required,
      ],
      employeeCargoReporteId: ['', Validators.required],
      userName: ['', Validators.required],
    });
  }

  loadData(id: number) {
    this.subRef$ = this.dataService
      .get(`Ticket/FromSistemas/${id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.form.patchValue(resp.body);
        this.urlBaseImg = `${environment.base_urlImg}customers/${this.model.customerId}/report/`;
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const model = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`Ticket/CreateFromSistemas`, model)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`Ticket/FromSistemas/${this.id}`, model)
        .subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }

  createFormData(dto: any) {
    const formData = new FormData();
    if (dto.status === 1) {
      dto.dateFinished = new Date().toUTCString();
    }
    formData.append(
      'dateRequest',
      this.dateService.getDateFormat(dto.dateRequest)
    );
    formData.append('activity', dto.activity);
    formData.append('observations', dto.observations);
    formData.append('status', String(dto.status));
    formData.append('priority', String(dto.priority));
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (dto.dateFinished !== null)
      formData.append('dateFinished', String(dto.dateFinished));
    if (dto.photoPathAfter) {
      formData.append('photoPathAfter', dto.photoPathAfter);
    }
    if (dto.photoPathBefore) {
      formData.append('photoPathBefore', dto.photoPathBefore);
    }
    formData.append('employeeCargoReporteId', dto.employeeCargoReporteId);
    formData.append('employeeResponsableId', dto.employeeResponsableId);

    return formData;
  }

  uploadFileAfter(file: File) {
    this.photoAfterFileUpdate = true;
    this.form.patchValue({ photoPathAfter: file });
  }
  uploadFileBefore(file: File) {
    this.photoBeforeFileUpdate = true;
    this.form.patchValue({ photoPathBefore: file });
  }

  onLoadApplicationUser() {
    this.subRef$ = this.dataService
      .get('SelectItem/AplicationUser/')
      .subscribe({
        next: (resp: any) => {
          this.cb_user = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
