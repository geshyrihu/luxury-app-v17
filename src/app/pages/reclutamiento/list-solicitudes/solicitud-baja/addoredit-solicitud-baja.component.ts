import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-solicitud-baja',
  templateUrl: './addoredit-solicitud-baja.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddoreditSolicitudBajaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  cb_status: ISelectItem[] = [];
  cb_tipo_baja: ISelectItem[] = [];
  cb_si_no: ISelectItem[] = [];

  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    reasonForLeaving: [],
    tipoBaja: [null],
    executionDate: [],
    lawyerAssistance: [null],
    employeeInformed: [null],
    status: [null],
    discounts: this.formBuilder.array([]),
    applicationUserId: [],
    employeeId: [],
    folio: [],
    requestDate: [],
    workPositionId: [],
  });

  async ngOnInit() {
    this.cb_si_no = await this.enumSelectService.boolYesNo();
    this.cb_status = await this.enumSelectService.status();
    this.cb_tipo_baja = await this.enumSelectService.tipoBaja(false);
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `RequestDismissal/GetById/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      // Luego, recorre el arreglo de discounts y agrégalo al formArray 'discounts'
      result.discounts.forEach((discount: any) => {
        this.discounts.push(
          this.formBuilder.group({
            description: discount.description,
            discount: discount.discount,
            id: discount.id,
          })
        );
      });
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`RequestDismissal`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`RequestDismissal/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  addDiscountDescription() {
    const discountDescription = this.formBuilder.group({
      id: ['', Validators.required],
      description: ['', Validators.required],
      discount: ['', Validators.required],
    });
    this.discounts.push(discountDescription);
  }

  isControlInvalid(control: AbstractControl | null): boolean {
    if (control instanceof FormControl) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  removeDiscountDescription(index: number, id: number) {
    const urlApi = `RequestDismissalDiscount/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.discounts.removeAt(index);
    });
  }

  get discounts() {
    return this.form.get('discounts') as FormArray;
  }
}
