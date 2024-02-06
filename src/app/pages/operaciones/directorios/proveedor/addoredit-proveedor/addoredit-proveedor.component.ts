import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-proveedor',
  templateUrl: './addoredit-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgSelectModule, CustomInputModule],
})
export default class AddoreditProveedorComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id = 0;
  cb_category: ISelectItemDto[] = [];
  cb_nivel_acceso: ISelectItemDto[] = [
    {
      label: 'Publico',
      value: 0,
    },
    {
      label: 'Privado',
      value: 1,
    },
  ];
  catecoriasSeleccinadas: ISelectItemDto[] = [];
  cb_bancos: any[] = [];
  form: FormGroup;

  urlBaseImg = `${environment.base_urlImg}providers/`;
  model: any;
  photoFileUpdate: boolean = false;
  urlLogo = '';
  valueRfc: string = '';
  rfcCoincidente: any[] = [];
  get f() {
    return this.form.controls;
  }
  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('Categories')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_category = resp;
      });

    this.selectItemService
      .onGetSelectItem('Bank')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_bancos = resp;
      });
  }

  public saveBancoId(e: any): void {
    let find = this.cb_bancos.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      bankId: find?.value,
    });
  }
  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.getItem();
    }
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      address: ['', Validators.required],
      bankId: ['', Validators.required],
      cellPhoneOne: ['', Validators.required],
      cellPhoneTwo: [''],
      contactOne: ['', Validators.required],
      contactTwo: [''],
      emailOne: ['', Validators.required],
      emailTwo: [''],
      interbankCode: ['', Validators.required],
      nameCheck: ['', Validators.required],
      nameProvider: ['', Validators.required],
      nameComercial: [''],
      pathPhoto: [''],
      paymentAccount: ['', Validators.required],
      phoneOne: ['', Validators.required],
      phoneTwo: [''],
      positionOne: ['', Validators.required],
      positionTwo: [],
      repair: [false],
      rfc: ['', Validators.required],
      bankName: ['', Validators.required],
      sales: [false],
      employeeId: [0],
      convenio: [''],
      referencia: [''],
      webPage: [''],
      customerId: [1],
      categorias: [, Validators.required],
      nivelAcceso: [0, Validators.required],
      constanciaFiscal: [''],
    });
  }

  getItem() {
    this.dataService
      .get(`Proveedor/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
        this.form.patchValue({ bankId: resp.body.bankId });
        this.form.patchValue({ bankName: resp.body.bankName });
        this.urlLogo = `${this.urlBaseImg}${resp.body.pathPhoto}`;
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`Proveedor/`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`Proveedor/${this.id}`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  onCreateFormData(dto: any) {
    const formData = new FormData();
    formData.append('nameProvider', dto.nameProvider);
    formData.append('nameComercial', dto.nameComercial);
    formData.append('rfc', dto.rfc);
    formData.append('address', dto.address);
    if (dto.pathPhoto) {
      formData.append('pathPhoto', dto.pathPhoto);
    }
    if (dto.constanciaFiscal) {
      formData.append('constanciaFiscal', dto.constanciaFiscal);
    }
    formData.append('sales', String(dto.sales));
    formData.append('repair', String(dto.repair));
    formData.append('phoneOne', dto.phoneOne);
    formData.append('phoneTwo', dto.phoneTwo);
    formData.append('webPage', dto.webPage);
    formData.append('contactOne', dto.contactOne);
    formData.append('positionOne', dto.positionOne);
    formData.append('cellPhoneOne', dto.cellPhoneOne);
    formData.append('emailOne', dto.emailOne);
    formData.append('contactTwo', dto.contactTwo);
    formData.append('positionTwo', dto.positionTwo);
    formData.append('cellPhoneTwo', dto.cellPhoneTwo);
    formData.append('emailTwo', dto.emailTwo);
    formData.append('nameCheck', dto.nameCheck);
    formData.append('bankId', String(dto.bankId));
    formData.append('paymentAccount', String(dto.paymentAccount));
    formData.append('interbankCode', String(dto.interbankCode));

    if (this.id == 0) {
      formData.append(
        'employeeId',
        String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
      );
    } else {
      formData.append('employeeId', String(dto.employeeId));
    }
    formData.append('convenio', dto.convenio);
    formData.append('referencia', dto.referencia);
    formData.append('customerId', dto.customerId);
    formData.append('nivelAcceso', String(dto.nivelAcceso));
    for (var i = 0; i < dto.categorias.length; i++) {
      formData.append('categorias', dto.categorias[i].value);
    }
    return formData;
  }

  // onSelectCategorias() {}

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ pathPhoto: file });
  }

  onValidarRFC() {
    this.dataService
      .get('Providers/ValidarRfc/' + this.valueRfc)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.rfcCoincidente = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  change(file: any) {
    this.form.patchValue({ constanciaFiscal: file });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
