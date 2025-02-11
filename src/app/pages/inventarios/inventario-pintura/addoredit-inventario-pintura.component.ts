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
  selector: 'app-addoredit-inventario-pintura',
  templateUrl: './addoredit-inventario-pintura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditInventarioPinturaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);

  submitting: boolean = false;

  cb_machinery: ISelectItem[] = [];
  cb_producto: ISelectItem[] = [];
  id: number = 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    machineryId: ['', Validators.required],
    machinery: ['', Validators.required],
    area: ['', Validators.required],
    productoId: ['', Validators.required],
    producto: ['', Validators.required],
    applicationUserId: [this.authS.applicationUserId],
  });

  ngOnInit(): void {
    this.onLoadMachinery();
    this.onLoadProducto();
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
    const urlApi = `InventarioPintura/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      this.form.patchValue({
        productoId: result.productoId,
      });
      this.form.patchValue({
        producto: result.producto,
      });
      this.form.patchValue({
        machineryId: result.machineryId,
      });
      this.form.patchValue({
        machinery: result.machinery,
      });
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`InventarioPintura`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`InventarioPintura/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onLoadMachinery() {
    const urlApi =
      'Machineries/GetAutocompeteInv/' + this.customerIdS.getCustomerId();
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.cb_machinery = result;
    });
  }
  onLoadProducto() {
    const urlApi = `productos/getautocompleteselectitem/`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.cb_producto = result;
    });
  }
}
