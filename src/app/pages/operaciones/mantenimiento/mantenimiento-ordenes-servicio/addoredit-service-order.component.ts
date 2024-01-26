import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { ETypeMaintance } from 'src/app/core/enums/type-maintance.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { EnumService } from 'src/app/core/services/enum.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ValidationErrorsCustomInputComponent from 'src/app/custom-components/custom-input-form/validation-errors-custom-input/validation-errors-custom-input.component';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-addoredit-service-order',
  templateUrl: './addoredit-service-order.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
    PrimeNgModule,
    ValidationErrorsCustomInputComponent,
  ],
  providers: [CustomToastService, MessageService],
})
export default class ServiceOrderAddOrEditComponent
  implements OnInit, OnDestroy
{
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public emumService = inject(EnumService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  public Editor = ClassicEditor;

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_machinery: any[] = [];
  cb_providers: any[] = [];
  cb_Status: SelectItem[] = onGetSelectItemFromEnum(EStatusTask);
  cb_TypeMaintance: SelectItem[] = onGetSelectItemFromEnum(ETypeMaintance);
  cb_user_customers: SelectItem[] = [];

  form: FormGroup;
  id: number = 0;
  idMachinery: number = null;
  idProvider: number = null;
  idUserResponsible: string = null;

  customerId: any;

  ngOnInit(): void {
    flatpickrFactory();
    this.customerId = this.customerIdService.getcustomerId();
    this.id = this.config.data.id;
    this.idMachinery = this.config.data.machineryId;
    this.idProvider = this.config.data.providerId;
    this.onLoadSelectItem();
    this.onLoadForm();
    if (this.id !== 0) this.onLoadData();
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp: any) => {
        this.cb_machinery = resp;
      });

    this.selectItemService
      .onGetSelectItem('Providers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_providers = resp;
      });

    this.selectItemService
      .onGetSelectItem(`GetUserCustomer/${this.customerId}`)
      .subscribe((resp) => {
        this.cb_user_customers = resp;
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
    let find = this.cb_user_customers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeResponsableId: find?.value,
    });
  }

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
      });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
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
