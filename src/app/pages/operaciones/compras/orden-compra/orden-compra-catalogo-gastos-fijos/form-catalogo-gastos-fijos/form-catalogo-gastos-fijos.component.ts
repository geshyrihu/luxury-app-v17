import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CatalogoGastosFijosService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
@Component({
  selector: 'app-form-catalogo-gastos-fijos',
  templateUrl: './form-catalogo-gastos-fijos.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    ComponentsModule,
    CommonModule,
    PrimeNgModule,
    CustomInputModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class FormCatalogoGastosFijosComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  public customerIdService = inject(CustomerIdService);
  submitting: boolean = false;
  subRef$: Subscription;

  @Input()
  id: number = 0;
  anio = 2021;
  cb_use_cfdi: any[] = [];
  cb_metodoDePago: any[] = [];
  cb_formaDePago: any[] = [];

  cb_providers: any[] = [];
  proveedor: SelectItem;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.customerId],
    equipoOInstalacion: ['', Validators.required],
    justificacionGasto: ['', Validators.required],
    providerName: ['', Validators.required],
    providerId: ['', Validators.required],
    usoCFDIId: ['', Validators.required],
    metodoDePagoId: [19, Validators.required],
    formaDePagoId: [1, Validators.required],
    catalogoGastosFijosPresupuesto: this.formBuilder.array([]),
    catalogoGastosFijosDetalles: this.formBuilder.array([]),
    applicationUserId: [
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
    ],
  });

  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
    this.selectItemService.onGetSelectItem('UseCFDI').subscribe((resp) => {
      this.cb_use_cfdi = resp;
    });
    this.selectItemService
      .onGetSelectItem('PaymentMethod')
      .subscribe((resp) => {
        this.cb_metodoDePago = resp;
      });
    this.selectItemService.onGetSelectItem('WayToPay').subscribe((resp) => {
      this.cb_formaDePago = resp;
    });

    this.id = this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    if (this.id !== 0) this.onLoadData();
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get<any>(`CatalogoGastosFijos/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.catalogoGastosFijosService.setCatalogoGastosFijosId(
            resp.body.id
          );

          this.form.patchValue(resp.body);
          this.form.patchValue({
            providerName: resp.body.provider,
          });
          this.customToastService.onClose();
        },
        error: (err) => {
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
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`CatalogoGastosFijos`, this.form.value)
        .subscribe({
          next: (resp: any) => {
            this.id = resp.body.id;
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
    } else {
      this.subRef$ = this.dataService
        .put(`CatalogoGastosFijos/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
