import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ERecurrence } from 'src/app/core/enums/recurrence.enum';
import { ETypeMaintance } from 'src/app/core/enums/type-maintance.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-addoredit-maintenance-preventive',
  templateUrl: './addoredit-maintenance-preventive.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
    PrimeNgModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditMaintenancePreventiveComponent
  implements OnInit, OnDestroy
{
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  public Editor = ClassicEditor;

  cb_machinery: ISelectItemDto[] = [];
  cb_providers: ISelectItemDto[] = [];
  cb_recurrencia: ISelectItemDto[] = onGetSelectItemFromEnum(ERecurrence);
  cb_subCuentaId: ISelectItemDto[] = [];
  cb_TypeMaintance: SelectItem[] = onGetSelectItemFromEnum(ETypeMaintance);

  submitting: boolean = false;
  subRef$: Subscription;

  form: FormGroup;
  id: any = 0;
  idMachinery: number = null;
  account_id = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  fecha: string | undefined;

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
  public saveSubCuentaId(e: any): void {
    let find = this.cb_subCuentaId.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      cuentaId: find?.value,
    });
  }
  get f() {
    return this.form.controls;
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp: any) => {
        this.cb_machinery = resp;
      });
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
    this.selectItemService
      .onGetSelectItem('CuentasContables')
      .subscribe((resp: any) => {
        this.cb_subCuentaId = resp;
      });
  }

  onGetMachinerySelectItem() {
    if (this.config.data.idMachinery !== 0) {
      this.subRef$ = this.dataService
        .get(
          `Machineries/GetMachinerySelectItem/${this.config.data.idMachinery}`
        )
        .subscribe({
          next: (resp: any) => {
            this.form.patchValue({
              machineryId: resp.body.value,
              machineryName: resp.body.label,
            });
            this.form.patchValue({
              typeMaintance: ETypeMaintance.Preventivo,
            });
          },
          error: (error) => {
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }

  ngOnInit(): void {
    this.idMachinery = this.config.data.idMachinery;
    if (this.config.data.fecha !== null) {
      this.fecha = this.config.data.fecha;
    }
    this.onLoadSelectItem();
    switch (this.config.data.task) {
      case 'create': {
        this.onGetMachinerySelectItem();
        break;
      }
      case 'edit': {
        this.onLoadData();
        break;
      }
      case 'copy': {
        this.LoadCopy();
        break;
      }
      default: {
        break;
      }
    }
    this.onLoadForm();
  }
  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      activity: ['', [Validators.required, Validators.maxLength(700)]],
      machineryId: ['', Validators.required],
      fechaServicio: [this.fecha, Validators.required],
      observation: [''],
      price: ['', Validators.required],
      providerId: ['', Validators.required],
      recurrence: ['', Validators.required],
      typeMaintance: ['', Validators.required],
      customerId: [this.customerIdService.getcustomerId()],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
      cuentaId: ['', Validators.required],
      // temp
      machineryName: ['', Validators.required],
      providerName: ['', Validators.required],
      cuentaName: ['', Validators.required],
    });
  }
  LoadCopy() {
    this.subRef$ = this.dataService
      .get(`MaintenanceCalendars/Get/${this.config.data.id}`)
      .subscribe((resp: any) => {
        this.id = 0;
        this.onPathForm(resp);
      });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`MaintenanceCalendars/Get/${this.config.data.id}`)
      .subscribe((resp: any) => {
        this.id = resp.body.id;

        this.onPathForm(resp);
      });
  }
  onPathForm(resp: any) {
    this.form.patchValue(resp.body);
    this.form.patchValue({
      machineryId: resp.body.machineryId.value,
    });
    this.form.patchValue({
      machineryName: resp.body.machineryId.label,
    });
    this.form.patchValue({
      providerId: resp.body.providerId.value,
    });
    this.form.patchValue({
      providerName: resp.body.providerId.label,
    });
    this.form.patchValue({
      cuentaId: resp.body.cuenta.value,
    });
    this.form.patchValue({
      cuentaName: resp.body.cuenta.label,
    });
  }
  // convenience getter for easy access to form fields

  submit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`MaintenanceCalendars`, this.form.value)
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
      this.subRef$ = this.dataService
        .put(`MaintenanceCalendars/${this.id}`, this.form.value)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
