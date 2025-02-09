import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-plantilla',
  templateUrl: './addoredit-plantilla.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddoreditPlantillaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  id: number = 0;
  checked: boolean = false;
  cb_profession: ISelectItem[] = [];
  cb_employee: ISelectItem[] = [];
  cb_turnoTrabajo: ISelectItem[] = [];
  cb_state: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.custIdService.getCustomerId(), Validators.required],
    folio: [''],
    professionId: ['', Validators.required],
    responsibleAreaId: [''],
    professionName: [''],
    sueldo: [0.0],
    sueldoBase: [0.0, Validators.required],
    state: [null, Validators.required],
    employeeId: [null],
    employeeName: [''],
    turnoTrabajo: [null],
    lunesEntrada: [''],
    lunesSalida: [''],
    martesEntrada: [''],
    martesSalida: [''],
    miercolesEntrada: [''],
    miercolesSalida: [''],
    juevesEntrada: [''],
    juevesSalida: [''],
    viernesEntrada: [''],
    viernesSalida: [''],
    sabadoEntrada: [''],
    sabadoSalida: [''],
    domingoEntrada: [''],
    domingoSalida: [''],
    observationsWorkShift: [''],
  });

  async ngOnInit() {
    this.cb_turnoTrabajo = await this.enumSelectService.turnoTrabajo();
    this.cb_state = await this.enumSelectService.state();
    this.onProfessionSelectItem();
    this.onProfessionSelectItem();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `WorkPosition/GetForEdit/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      this.form.patchValue({
        id: this.id,
      });
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.form.patchValue({
      professionName: '',
      employeeName: '',
    });

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`WorkPosition`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`WorkPosition/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onProfessionSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`Employee/${this.custIdService.getCustomerId()}`)
      .then((response: any) => {
        this.cb_employee = response;
      });
  }
  public saveemployeeIdId(e: any): void {
    let find = this.cb_employee.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeId: find?.value,
    });
  }
  public saveprofessionIdId(e): void {
    let find = this.cb_profession.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
    });
  }
}
