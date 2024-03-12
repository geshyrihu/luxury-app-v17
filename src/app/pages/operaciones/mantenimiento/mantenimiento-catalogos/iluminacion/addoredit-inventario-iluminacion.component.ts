import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-addoredit-inventario-iluminacion',
  templateUrl: './addoredit-inventario-iluminacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditInventarioIluminacionComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public apiRequestService = inject(ApiRequestService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  cb_machinery: ISelectItemDto[] = [];
  cb_producto: ISelectItemDto[] = [];

  id: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    machineryId: ['', Validators.required],
    machinery: ['', Validators.required],
    area: ['', Validators.required],
    cantidad: ['', Validators.required],
    productoId: ['', Validators.required],
    producto: ['', Validators.required],
    employeeId: [
      this.authService.userTokenDto.infoEmployeeDto.employeeId,
      Validators.required,
    ],
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
    this.apiRequestService
      .onGetItem(`InventarioIluminacion/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`InventarioIluminacion`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`InventarioIluminacion/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadMachinery() {
    this.apiRequestService
      .onGetList(
        'Machineries/GetAutocompeteInv/' +
          this.customerIdService.getcustomerId()
      )
      .then((result: any) => {
        this.cb_machinery = result;
      });
  }
  onLoadProducto() {
    this.apiRequestService
      .onGetList('Productos/GetAutoCompleteSelectItem/')
      .then((result: any) => {
        this.cb_producto = result;
      });
  }
}
