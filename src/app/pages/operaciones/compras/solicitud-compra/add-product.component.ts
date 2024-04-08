import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddProductComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  solicitudCompraService = inject(SolicitudCompraService);

  id: any = 0;
  products: any[] = [];
  ref: DynamicDialogRef;
  productSelect: string = '';

  @Input()
  solicitudCompraId: number = 0;
  cb_measurement_units: ISelectItem[] = [];

  @Output()
  updateData = new EventEmitter<void>();

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    productoId: [],
    productName: ['', Validators.required],
    cantidad: [0, Validators.required],
    unidadMedidaId: ['', Validators.required],
    solicitudCompraId: [],
    employeeId: [],
  });
  onUpdateData() {
    this.updateData.emit();
  }

  ngOnInit(): void {
    this.solicitudCompraService.deleteProduct$.subscribe(() => {
      this.onLoadProduct();
    });
    this.onLoadProduct();

    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_measurement_units = response;
      });
  }

  onLoadProduct() {
    this.apiRequestService
      .onGetList(
        `SolicitudCompraDetalle/AddProductoToSolicitudDto/${this.solicitudCompraId}`
      )
      .then((result: any) => {
        this.products = result;
      });
  }

  onSubmit() {
    this.form.patchValue({
      solicitudCompraId: this.solicitudCompraId,
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });

    this.apiRequestService
      .onPost(`SolicitudCompraDetalle`, this.form.value)
      .then((result: boolean) => {
        this.onUpdateData();
        this.onLoadProduct();
        this.form.reset();
      });
  }

  public onSelectProduct(e: any): void {
    let find = this.products.find((x) => x?.producto === e.target.value);
    this.form.patchValue({
      productoId: find?.productoId,
    });
  }
}
