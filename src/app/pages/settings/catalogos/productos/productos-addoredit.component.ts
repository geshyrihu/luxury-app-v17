import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-productos-addoredit',
  templateUrl: './productos-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class ProductosAddOrEditComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  id: any = 0;
  urlBaseImg = '';
  model: any;
  photoFileUpdate: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: new FormControl({ value: this.id, disabled: true }),
    category: ['', Validators.required],
    categoryId: ['', Validators.required],
    clasificacion: [null, Validators.required],
    applicationUserId: [this.authS.applicationUserId],
    marca: [''],
    modelo: [''],
    nombreProducto: [
      '',
      [Validators.required, Validators.maxLength(45), Validators.minLength(5)],
    ],
    urlImagen: [''],
  });
  cb_category: ISelectItem[] = [];
  cb_clasificacion: ISelectItem[] = [];

  onloadData() {
    this.apiRequestService.onGetSelectItem('Categories').then((result: any) => {
      this.cb_category = result;
    });
  }

  public savecategoryId(e: any): void {
    let find = this.cb_category.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      categoryId: find?.value,
    });
  }
  async ngOnInit() {
    this.cb_clasificacion = await this.enumSelectService.productClasificacion();
    this.onloadData();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    // this.form =
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ urlImagen: file });
  }

  onLoadData() {
    this.apiRequestService
      .onGetItem(`Productos/${this.id}`)
      .then((result: any) => {
        this.urlBaseImg = result.urlImagen;
        this.form.patchValue(result);
        this.form.patchValue({ category: result.category.nameCotegory });
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;
    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Productos`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Productos/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  private createFormData(dto: any): FormData {
    if (dto.marca == null || dto.marca == 'null') {
      dto.marca = '';
    }
    if (dto.modelo == null || dto.modelo == 'null') {
      dto.modelo = '';
    }
    const formData = new FormData();
    formData.append('nombreProducto', dto.nombreProducto);
    formData.append('categoryId', String(dto.categoryId));
    formData.append('marca', dto.marca);
    formData.append('modelo', dto.modelo);
    formData.append('clasificacion', String(dto.clasificacion));
    formData.append('applicationUserId', dto.applicationUserId);

    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.urlImagen) {
      formData.append('urlImagen', dto.urlImagen);
    }
    return formData;
  }
}
