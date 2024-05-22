import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EInventoryCategory } from 'src/app/core/enums/inventory-category.enum';
import { EState } from 'src/app/core/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-activos',
  templateUrl: './addoredit-activos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
})
export default class AddOrEditActivosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  getdateService = inject(DateService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  urlBaseImg = '';
  id: number = 0;
  user = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  customerId: number = this.customerIdService.getCustomerId();
  machineryDTO: any;
  photoFileUpdate: boolean = false;
  category: any;
  cb_equipoClasificacion: ISelectItem[] = [];

  form: FormGroup;

  cb_inventoryCategory: ISelectItem[] =
    onGetSelectItemFromEnum(EInventoryCategory);
  optionActive: ISelectItem[] = onGetSelectItemFromEnum(EState);
  ngOnInit(): void {
    this.onLoadEquipoClasificacion();
    this.urlBaseImg = `${
      environment.base_urlImg
    }customers/${this.customerIdService.getCustomerId()}/machinery/`;
    this.category = this.config.data.inventoryCategory;

    if (this.config.data.id !== 0) this.onLoadData(this.config.data.id);

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      brand: [''],
      customerId: [this.customerId],
      dateOfPurchase: ['', [Validators.required]],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
      equipoClasificacionId: ['', Validators.required],
      inventoryCategory: [this.category, [Validators.required]],
      model: [''],
      nameMachinery: ['', [Validators.required, Validators.minLength(5)]],
      observations: [''],
      photoPath: [''],
      serie: [''],
      state: ['', [Validators.required]],
      technicalSpecifications: [''],
      ubication: ['', [Validators.required]],
    });
  }
  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
  onLoadData(id: number) {
    const urlApi = `Machineries/${id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.id = result.id;
      result.dateOfPurchase = this.getdateService.getDateFormat(
        result.dateOfPurchase
      );
      this.form.patchValue(result);

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
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    const model = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`machineries`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`machineries/${this.id}`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  private createFormData(machineryDTO: any): FormData {
    let formData = new FormData();
    formData.append('employeeId', machineryDTO.employeeId);
    formData.append('nameMachinery', machineryDTO.nameMachinery);
    formData.append('ubication', machineryDTO.ubication);
    formData.append('brand', machineryDTO.brand);
    formData.append('serie', machineryDTO.serie);
    formData.append('model', machineryDTO.model);
    formData.append('state', String(machineryDTO.state));
    formData.append(
      'dateOfPurchase',
      this.dateService.getDateFormat(machineryDTO.dateOfPurchase)
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
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_equipoClasificacion = result;
    });
  }
}
