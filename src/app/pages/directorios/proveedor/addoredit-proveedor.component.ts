import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-proveedor',
  templateUrl: './addoredit-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgSelectModule, CustomInputModule],
})
export default class AddoreditProveedorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id = 0;
  cb_category: ISelectItem[] = [];
  cb_nivel_acceso: ISelectItem[] = [
    {
      label: 'Publico',
      value: 0,
    },
    {
      label: 'Privado',
      value: 1,
    },
  ];
  catecoriasSeleccinadas: ISelectItem[] = [];
  cb_bancos: any[] = [];
  form: FormGroup;

  model: any;
  photoFileUpdate: boolean = false;
  urlLogo = '';
  valueRfc: string = '';
  rfcCoincidente: any[] = [];
  get f() {
    return this.form.controls;
  }
  onLoadSelectItem() {
    this.apiRequestS.onGetSelectItem(`Categories`).then((response: any) => {
      this.cb_category = response;
    });

    this.apiRequestS.onGetSelectItem(`Bank`).then((response: any) => {
      this.cb_bancos = response;
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
    this.form = this.formB.group({
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
      applicationUserId: [this.authS.applicationUserId],
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
    this.apiRequestS.onGetItem(`Proveedor/${this.id}`).then((result: any) => {
      this.form.patchValue(result);
      this.form.patchValue({ bankId: result.bankId });
      this.form.patchValue({ bankName: result.bankName });
      this.urlLogo = result.pathPhoto;
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    const model = this.onCreateFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS.onPost(`Proveedor/`, model).then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
    } else {
      this.apiRequestS
        .onPut(`Proveedor/${this.id}`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
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
    formData.append('applicationUserId', String(this.authS.applicationUserId));

    formData.append('convenio', dto.convenio);
    formData.append('referencia', dto.referencia);
    formData.append('customerId', dto.customerId);
    formData.append('nivelAcceso', String(dto.nivelAcceso));
    for (var i = 0; i < dto.categorias.length; i++) {
      formData.append('categorias', dto.categorias[i].value);
    }
    return formData;
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ pathPhoto: file });
  }

  onValidarRFC() {
    this.apiRequestS
      .onGetList('Providers/ValidarRfc/' + this.valueRfc)
      .then((result: any) => {
        this.rfcCoincidente = result;
      });
  }

  change(file: any) {
    this.form.patchValue({ constanciaFiscal: file });
  }
}
