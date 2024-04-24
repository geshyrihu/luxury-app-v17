import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { EStatusOrdenCompra } from 'src/app/core/enums/estatus-orden-compra.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
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
})
export default class SolicitudCompraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  routeActive = inject(ActivatedRoute);
  router = inject(Router);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  statusCompra: ISelectItem[] = onGetSelectItemFromEnum(EStatusOrdenCompra);
  _cb_Status = [];
  id: number = 0;
  solicitudCompra: any;
  idAuth: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  public get cb_Status() {
    return this._cb_Status;
  }

  type: string = '';
  ref: DynamicDialogRef;
  SolicitudCompraDetalle: any[] = [];
  form: FormGroup;
  imprimir = false;
  cotizacionesRelacionadas: any[] = [];

  ngOnInit(): void {
    this.routeActive.params.subscribe((resp) => {
      this.id = resp['id'];
    });
    this.idAuth =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.createForm();
    if (Number(this.id) !== 0) {
      this.onLoadData();
      this.onCotizacionesRelacionadas();
    }
  }
  get f() {
    return this.form.controls;
  }
  //TODO: CREAR UN SERVICIO PARA REFRESCAR CUANDO SE ELIMINA UN PRODUCTO
  createForm() {
    return (this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerIdService.getCustomerId()],
      fechaSolicitud: [],
      solicita: ['', Validators.required],
      equipoOInstalacion: ['', Validators.required],
      justificacionGasto: ['', Validators.required],
      estatus: [2],
      folio: [''],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    }));
  }
  onCotizacionesRelacionadas() {
    this.apiRequestService
      .onGetList(`OrdenCompra/CotizacionesRelacionadas/${this.id}`)
      .then((result: any) => {
        this.cotizacionesRelacionadas = result;
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
    this.apiRequestService
      .onGetItem(`SolicitudCompra/GetSolicitudCompraIndividual/${this.id}`)
      .then((result: any) => {
        this.solicitudCompra = result;
        this.onSetTipe(result.estatus);
        result.fechaSolicitud = this.dateService.getDateFormat(
          result.fechaSolicitud
        );
        this.form.patchValue(result);
        this.SolicitudCompraDetalle =
          this.solicitudCompra.solicitudCompraDetalle;
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    if (Number(this.id) === 0) {
      this.apiRequestService
        .onPost(`solicitudcompra`, this.form.value)
        .then((result: any) => {
          if (result) {
            this.id = Number(result.id);
            this.onLoadData();
            this.submitting = false;
          }
        });
    } else {
      this.apiRequestService
        .onPut(`solicitudcompra/${this.id}`, this.form.value)
        .then((result: boolean) => {
          if (result) {
            this.onLoadData();
            this.submitting = false;
          }
        });
    }
  }
  addProduct(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddProductComponent,
        {
          solicitudCompraId: this.solicitudCompra.id,
          id: data.id,
        },
        'Agregar',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  addProductModal(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddProductModalComponent,
        {
          solicitudCompraId: this.solicitudCompra.id,
          id: data.id,
        },
        'Agregar',
        this.dialogHandlerService.dialogSizeFull
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onModalCreateOrdenCompra() {
    this.dialogHandlerService
      .openDialog(
        CreateOrdenCompraComponent,
        {
          solicitudCompraId: this.id,
          folioSolicitudCompra: this.solicitudCompra.folio,
        },
        'Crear Orden de compra',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((ordenCompraId: any) => {
        if (ordenCompraId !== undefined) {
          this.router.navigateByUrl(
            `operaciones/compras/orden-compra/${ordenCompraId}`
          );
        }
      });
  }
  // Navegar a la Orden de compra
  onAddOrEdit(id: number) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${id}`);
  }
}
// 253 lines
