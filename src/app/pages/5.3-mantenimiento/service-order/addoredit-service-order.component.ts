import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { ETypeMaintance } from 'src/app/core/enums/type-maintance.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ValidationErrorsCustomInputComponent from 'src/app/custom-components/custom-input-form/validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
  selector: 'app-addoredit-service-order',
  templateUrl: './addoredit-service-order.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CustomInputModule,
    ValidationErrorsCustomInputComponent,
  ],
})
export default class ServiceOrderAddOrEditComponent
  implements OnInit, OnDestroy
{
  customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataConnectorService);
  dateService = inject(DateService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_machinery: any[] = [];
  cb_providers: any[] = [];
  cb_Status: SelectItem[] = onGetSelectItemFromEnum(EStatusTask);
  cb_TypeMaintance: SelectItem[] = onGetSelectItemFromEnum(ETypeMaintance);
  cb_applicationUser: SelectItem[] = [];

  form: FormGroup;
  id: number = 0;
  idMachinery: number = null;
  idProvider: number = null;
  idUserResponsible: string = null;

  customerId: any;

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      activity: ['', [Validators.required]],
      requestDate: ['', Validators.required],
      status: ['', [Validators.required]],
      providerId: ['', Validators.required],
      provider: ['', Validators.required],
      price: ['', [Validators.required]],
      employeeResponsableId: ['', Validators.required],
      employeeResponsable: ['', Validators.required],
      typeMaintance: ['', Validators.required],
      executionDate: [''],
      observations: [''],
      cumplimientoActividades: [false, Validators.required],
      equiposOperando: [false, Validators.required],
      ocacionoDanos: [false, Validators.required],
      calidadTrabajos: [false, Validators.required],
      maintenanceCalendarId: [null],
    });
  }

  ngOnInit(): void {
    flatpickrFactory();
    this.customerId = this.customerIdService.getCustomerId();
    this.id = this.config.data.id;
    this.idMachinery = this.config.data.machineryId;
    this.idProvider = this.config.data.providerId;
    this.onLoadSelectItem();
    this.onLoadForm();
    if (this.id !== 0) this.onLoadData();
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_machinery = response;
      });

    this.apiRequestService
      .onGetSelectItem(`Providers`)
      .then((response: any) => {
        this.cb_providers = response;
      });

    this.apiRequestService
      .onGetSelectItem(`UserFromCustomer/${this.customerId}`)
      .then((response: any) => {
        this.cb_applicationUser = response;
      });
  }

  public saveMachineryId(e: any): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }
  public saveResponsibleUserId(e: any): void {
    let find = this.cb_applicationUser.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeResponsableId: find?.value,
    });
  }

  onLoadData() {
    this.dataService
      .get(`ServiceOrders/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        resp.body.executionDate = this.dateService.getDateFormat(
          resp.body.executionDate
        );
        resp.body.requestDate = this.dateService.getDateFormat(
          resp.body.requestDate
        );

        this.form.patchValue(resp.body);
        const contenidoHTML = this.form.get('activity').value;
        const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
        this.form.get('activity').patchValue(contenidoSinHTML);

        const contenidoHTML2 = this.form.get('observations').value;
        const contenidoSinHTML2 = contenidoHTML2.replace(/<[^>]*>|&nbsp;/g, '');
        this.form.get('observations').patchValue(contenidoSinHTML2);
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`ServiceOrders`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`ServiceOrders/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  get f() {
    return this.form.controls;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
