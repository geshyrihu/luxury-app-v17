import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { EStatusOrdenCompra } from 'src/app/core/enums/estatus-orden-compra.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CreateOrdenCompraComponent from '../orden-compra/orden-compra/create-orden-compra/create-orden-compra.component';
import AddProductModalComponent from './add-product-modal.component';
import AddProductComponent from './add-product.component';
import SolicitudCompraDetalleComponent from './solicitud-compra-detalle/solicitud-compra-detalle.component';

@Component({
  selector: 'app-solicitud-compra',
  templateUrl: './solicitud-compra.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbar,
    SolicitudCompraDetalleComponent,
    AddProductComponent,
    ToastModule,
    RouterModule,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class SolicitudCompraComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public routeActive = inject(ActivatedRoute);
  public router = inject(Router);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  statusCompra: ISelectItemDto[] = onGetSelectItemFromEnum(EStatusOrdenCompra);
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
  subRef$: Subscription;
  SolicitudCompraDetalle: any[] = [];
  form: FormGroup;
  imprimir = false;
  cotizacionesRelacionadas: any[] = [];

  ngOnInit(): void {
    // this.enumService
    //   .onGetSelectItemEmun('EStatusOrdenCompra')
    //   .subscribe((resp) => {
    //     this.statusCompra = resp;
    //   });
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
      customerId: [this.customerIdService.getcustomerId()],
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
    this.subRef$ = this.dataService
      .get(`OrdenCompra/CotizacionesRelacionadas/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.cotizacionesRelacionadas = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
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
    this.subRef$ = this.dataService
      .get(`SolicitudCompra/GetSolicitudCompraIndividual/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.solicitudCompra = resp.body;
          this.onSetTipe(resp.body.estatus);
          resp.body.fechaSolicitud = this.dateService.getDateFormat(
            resp.body.fechaSolicitud
          );
          this.form.patchValue(resp.body);

          this.SolicitudCompraDetalle =
            this.solicitudCompra.solicitudCompraDetalle;

          this.customToastService.onClose();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
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

    if (Number(this.id) === 0) {
      this.subRef$ = this.dataService
        .post(`SolicitudCompra/`, this.form.value)
        .subscribe({
          next: (resp: any) => {
            this.id = Number(resp.body.id);
            this.onLoadData();
            this.submitting = false;
            this.customToastService.onCloseToSuccess();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`SolicitudCompra/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.submitting = false;
            this.onLoadData();
            this.customToastService.onCloseToSuccess();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }
  addProduct(data: any) {
    this.ref = this.dialogService.open(AddProductComponent, {
      data: {
        solicitudCompraId: this.solicitudCompra.id,
        id: data.id,
      },
      header: 'Agregar ',
      styleClass: 'modal-md',
      width: '1200px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe(() => {
      this.customToastService.onShowSuccess();
      this.onLoadData();
    });
  }
  addProductModal(data: any) {
    this.ref = this.dialogService.open(AddProductModalComponent, {
      data: {
        solicitudCompraId: this.solicitudCompra.id,
        id: data.id,
      },
      header: 'Agregar ',
      styleClass: 'modal-md',
      width: '1200px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe(() => {
      this.customToastService.onShowSuccess();
      this.onLoadData();
    });
  }

  onModalCreateOrdenCompra() {
    this.ref = this.dialogService.open(CreateOrdenCompraComponent, {
      data: {
        solicitudCompraId: this.id,
        folioSolicitudCompra: this.solicitudCompra.folio,
      },
      header: 'Crear Orden de compra',
      width: '1000px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((ordenCompraId: number) => {
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
