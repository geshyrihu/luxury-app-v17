import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EProductClasificacion } from 'src/app/core/enums/product-clasificacion.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-productos',
  templateUrl: './addoredit-productos.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditProductosComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  private customToastService = inject(CustomToastService);
  private enumService = inject(EnumService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: any = 0;
  urlBaseImg = '';
  model: any;
  photoFileUpdate: boolean = false;
  userId = '';
  form: FormGroup;
  cb_category: any[] = [];
  cb_clasificacion: ISelectItemDto[] = onGetSelectItemFromEnum(
    EProductClasificacion
  );

  onLoadSelectItem() {
    this.selectItemService.onGetSelectItem('Categories').subscribe((resp) => {
      this.cb_category = resp;
    });
  }

  public savecategoryId(e: any): void {
    let find = this.cb_category.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      categoryId: find?.value,
    });
  }
  ngOnInit(): void {
    this.userId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      nombreProducto: ['', Validators.required],
      categoryId: ['', Validators.required],
      category: ['', Validators.required],
      urlImagen: [''],
      marca: [''],
      modelo: [''],
      clasificacion: [EProductClasificacion.Producto],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    });
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ urlImagen: file });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Productos/${this.id}`)
      .subscribe((resp: any) => {
        this.urlBaseImg = `${environment.base_urlImg}Administration/products/${resp.body.urlImagen}`;
        this.form.patchValue(resp.body);
        this.form.patchValue({ category: resp.body.category.nameCotegory });
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const formData = this.createFormData(this.form.value);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService.post('Productos', formData).subscribe({
        next: () => {
          this.ref.close(true);
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
    } else {
      this.subRef$ = this.dataService
        .put(`Productos/${this.id}`, formData)
        .subscribe({
          next: () => {
            this.ref.close(true);
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
    formData.append('employeeId', dto.employeeId);

    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.urlImagen) {
      formData.append('urlImagen', dto.urlImagen);
    }

    return formData;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
