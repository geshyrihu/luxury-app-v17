import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ERouteRecurrence } from 'src/app/core/enums/route-recurrence.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-recorrido',
  templateUrl: './addoreedit-recorrido.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class RecorridoAddOrEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  form: FormGroup;
  id: number = 0;
  cb_machinery: ISelectItem[] = [];
  idMachinery: number = null;
  cb_RouteRecurrence: ISelectItem[] = onGetSelectItemFromEnum(ERouteRecurrence);

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_machinery = response;
      });
  }

  public saveMachineryId(e): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.onLoadSelectItem();
    this.onLoadForm();
  }

  onLoadData() {
    const urlApi = `Routes/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      position: ['', Validators.required],
      routeRecurrence: [0, Validators.required],
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Routes`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Routes/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  createModel(form: any) {
    return {
      machineryId: form.machineryId.value,
      position: form.position,
      routeRecurrence: form.routeRecurrence,
    };
  }
}
