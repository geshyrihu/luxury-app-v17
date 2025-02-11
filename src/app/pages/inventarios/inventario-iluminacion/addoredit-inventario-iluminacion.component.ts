import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-inventario-iluminacion',
  templateUrl: './addoredit-inventario-iluminacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditInventarioIluminacionComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  submitting: boolean = false;

  cb_machinery: ISelectItem[] = [];
  cb_producto: ISelectItem[] = [];

  id: number = 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    machineryId: ['', Validators.required],
    machinery: ['', Validators.required],
    area: ['', Validators.required],
    cantidad: ['', Validators.required],
    productoId: ['', Validators.required],
    producto: ['', Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
  });

  ngOnInit(): void {
    this.onLoadProducto();
    this.onLoadMachinery();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  public saveProductoId(e: any): void {
    let find = this.cb_producto.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      productoId: find?.value,
    });
  }
  public saveMachineryId(e: any): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`InventarioIluminacion/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`InventarioIluminacion`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`InventarioIluminacion/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadMachinery() {
    this.apiRequestS
      .onGetList(
        'Machineries/GetAutocompeteInv/' + this.customerIdS.getCustomerId()
      )
      .then((responseData: any) => {
        this.cb_machinery = responseData;
      });
  }
  onLoadProducto() {
    this.apiRequestS
      .onGetList('Productos/GetAutoCompleteSelectItem/')
      .then((responseData: any) => {
        this.cb_producto = responseData;
      });
  }
}
