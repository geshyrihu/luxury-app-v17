import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-activos',
  templateUrl: './addoredit-activos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
  providers: [EnumSelectService],
})
export default class AddOrEditActivosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  getdateService = inject(DateService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  enumSelectS = inject(EnumSelectService);

  submitting: boolean = false;

  id: number = 0;
  applicationUserId = this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
  customerId: number = this.customerIdS.getCustomerId();
  machineryDTO: any;
  photoFileUpdate: boolean = false;
  category: any;
  cb_equipoClasificacion: ISelectItem[] = [];

  form: FormGroup;

  cb_inventoryCategory: ISelectItem[] = [];
  optionActive: ISelectItem[] = [];
  async ngOnInit() {
    await this.onLoadEnum();
    this.onLoadEquipoClasificacion();

    this.category = this.config.data.inventoryCategory;

    if (this.config.data.id !== 0) this.onLoadData(this.config.data.id);

    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      brand: [''],
      customerId: [this.customerId],
      dateOfPurchase: ['', [Validators.required]],
      equipoClasificacionId: [null, Validators.required],
      inventoryCategory: [this.category, [Validators.required]],
      model: [''],
      nameMachinery: ['', [Validators.required, Validators.minLength(5)]],
      observations: [''],
      photoPath: [''],
      serie: [''],
      state: [null, [Validators.required]],
      technicalSpecifications: [''],
      ubication: ['', [Validators.required]],
      applicationUserId: [this.authS.applicationUserId],
    });
  }
  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
  onLoadData(id: number) {
    const urlApi = `Machineries/${id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.id = responseData.id;
      responseData.dateOfPurchase = this.getdateService.getDateFormat(
        responseData.dateOfPurchase
      );
      this.form.patchValue(responseData);

      const contenidoHTML = this.form.get('technicalSpecifications').value;
      if (contenidoHTML) {
        const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
        this.form.get('technicalSpecifications').patchValue(contenidoSinHTML);
      }

      const contenidoHTML2 = this.form.get('observations').value;
      if (contenidoHTML2) {
        const contenidoSinHTML2 = contenidoHTML2.replace(/<[^>]*>|&nbsp;/g, '');
        this.form.get('observations').patchValue(contenidoSinHTML2);
      }
    });
  }

  async onLoadEnum() {
    this.cb_inventoryCategory = await this.enumSelectS.inventoryCategory();
    this.optionActive = await this.enumSelectS.state();
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    const model = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`machineries`, model)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`machineries/${this.id}`, model)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  private createFormData(machineryDTO: any): FormData {
    let formData = new FormData();
    formData.append('applicationUserId', machineryDTO.applicationUserId);
    formData.append('nameMachinery', machineryDTO.nameMachinery);
    formData.append('ubication', machineryDTO.ubication);
    formData.append('brand', machineryDTO.brand);
    formData.append('serie', machineryDTO.serie);
    formData.append('model', machineryDTO.model);
    formData.append('state', String(machineryDTO.state));
    formData.append(
      'dateOfPurchase',
      this.dateS.getDateFormat(machineryDTO.dateOfPurchase)
    );
    formData.append('customerId', String(this.customerId));
    formData.append(
      'equipoClasificacionId',
      String(machineryDTO.equipoClasificacionId)
    );
    formData.append(
      'inventoryCategory',
      String(machineryDTO.inventoryCategory)
    );
    formData.append(
      'technicalSpecifications',
      machineryDTO.technicalSpecifications
    );
    formData.append('observations', machineryDTO.observations);
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (machineryDTO.photoPath) {
      formData.append('photoPath', machineryDTO.photoPath);
    }
    return formData;
  }

  onLoadEquipoClasificacion() {
    const urlApi = `equipoclasificacion/selectitem`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_equipoClasificacion = responseData;
    });
  }
}
