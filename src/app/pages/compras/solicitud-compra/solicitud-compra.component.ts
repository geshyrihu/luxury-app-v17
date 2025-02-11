import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CreateOrdenCompraComponent from '../orden-compra/orden-compra/create-orden-compra/create-orden-compra.component';
import AddProductModalComponent from './add-product-modal.component';
import AddProductComponent from './add-product.component';
import SolicitudCompraDetalleComponent from './solicitud-compra-detalle/solicitud-compra-detalle.component';

@Component({
  selector: 'app-solicitud-compra',
  templateUrl: './solicitud-compra.component.html',
  standalone: true,
  imports: [
    AddProductComponent,
    LuxuryAppComponentsModule,
    NgbProgressbar,
    SolicitudCompraDetalleComponent,
  ],
  providers: [EnumSelectService],
})
export default class SolicitudCompraComponent implements OnInit {
  enumSelectS = inject(EnumSelectService);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  dialogHandlerS = inject(DialogHandlerService);
  formB = inject(FormBuilder);
  routeActive = inject(ActivatedRoute);
  router = inject(Router);

  submitting: boolean = false;

  statusCompra: ISelectItem[] = [];
  _cb_Status = [];
  id: number = 0;
  solicitudCompra: any;
  public get cb_Status() {
    return this._cb_Status;
  }

  type: string = '';
  ref: DynamicDialogRef;
  SolicitudCompraDetalle: any[] = [];
  form: FormGroup;
  imprimir = false;
  cotizacionesRelacionadas: any[] = [];

  async ngOnInit() {
    this.routeActive.params.subscribe((resp) => {
      this.id = resp['id'];
    });
    this.createForm();
    if (Number(this.id) !== 0) {
      this.onLoadData();
      this.onCotizacionesRelacionadas();
    }
    this.statusCompra = await this.enumSelectS.typeStatusOrdenCompra(false);
  }
  get f() {
    return this.form.controls;
  }
  //TODO: CREAR UN SERVICIO PARA REFRESCAR CUANDO SE ELIMINA UN PRODUCTO
  createForm() {
    return (this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerIdS.getCustomerId()],
      fechaSolicitud: [],
      solicita: ['', Validators.required],
      equipoOInstalacion: ['', Validators.required],
      justificacionGasto: ['', Validators.required],
      estatus: [2],
      folio: [''],
      applicationUserId: [this.authS.applicationUserId],
    }));
  }
  onCotizacionesRelacionadas() {
    this.apiRequestS
      .onGetList(`OrdenCompra/CotizacionesRelacionadas/${this.id}`)
      .then((responseData: any) => {
        this.cotizacionesRelacionadas = responseData;
      });
  }

  onSetTipe(value: number) {
    if (value === 0) {
      this.type = 'success';
    }
    if (value === 1) {
      this.type = 'secondary';
    }
    if (value === 2) {
      this.type = 'danger';
    }
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`SolicitudCompra/GetSolicitudCompraIndividual/${this.id}`)
      .then((responseData: any) => {
        this.solicitudCompra = responseData;
        this.onSetTipe(responseData.estatus);
        responseData.fechaSolicitud = this.dateS.getDateFormat(
          responseData.fechaSolicitud
        );
        this.form.patchValue(responseData);
        this.SolicitudCompraDetalle =
          this.solicitudCompra.solicitudCompraDetalle;
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    if (Number(this.id) === 0) {
      this.apiRequestS
        .onPost(`SolicitudCompra`, this.form.value)
        .then((responseData: any) => {
          if (responseData) {
            this.id = Number(responseData.id);
            this.onLoadData();
            this.submitting = false;
          }
        });
    } else {
      this.apiRequestS
        .onPut(`SolicitudCompra/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          if (responseData) {
            this.onLoadData();
            this.submitting = false;
          }
        });
    }
  }
  addProduct(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddProductComponent,
        {
          solicitudCompraId: this.solicitudCompra.id,
          id: data.id,
        },
        'Agregar',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  addProductModal(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddProductModalComponent,
        {
          solicitudCompraId: this.solicitudCompra.id,
          id: data.id,
        },
        'Agregar',
        this.dialogHandlerS.dialogSizeFull
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onModalCreateOrdenCompra() {
    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompraComponent,
        {
          solicitudCompraId: this.id,
          folioSolicitudCompra: this.solicitudCompra.folio,
        },
        'Crear Orden de compra',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((ordenCompraId: any) => {
        if (ordenCompraId !== undefined) {
          this.router.navigateByUrl(`/compras/orden-compra/${ordenCompraId}`);
        }
      });
  }
  // Navegar a la Orden de compra
  onAddOrEdit(id: number) {
    this.router.navigateByUrl(`/compras/orden-compra/${id}`);
  }
}
// 253 lines
