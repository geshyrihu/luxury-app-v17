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
import { ETypePiscina } from 'src/app/core/enums/type-piscina.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-piscina',
  templateUrl: './addoredit-piscina.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditPiscinaComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  file: File;
  model: any;
  photoFileUpdate: boolean = false;
  subRef$: Subscription;

  cb_typePiscina: ISelectItemDto[] = onGetSelectItemFromEnum(ETypePiscina);
  form: FormGroup;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      name: ['', [Validators.required, Validators.maxLength(50)]],
      ubication: ['', [Validators.required, Validators.maxLength(50)]],
      volumen: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000000)],
      ],
      pathImage: [''],
      typePiscina: [0, Validators.required],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
      customerId: [this.customerIdService.getcustomerId()],
    });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`piscina/${this.id}`)
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.urlBaseImg = `${
          environment.base_urlImg
        }customers/${this.customerIdService.getcustomerId()}/piscina/`;
        this.form.patchValue(resp.body);
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const formDataDto = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService.post('piscina', formDataDto).subscribe({
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
        .put(`piscina/${this.id}`, formDataDto)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
          },
        });
    }
    this.submitting = false;
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();

    formData.append('name', dto.name);
    formData.append('ubication', dto.ubication);
    formData.append('volumen', dto.volumen);
    formData.append('typePiscina', String(dto.typePiscina));
    formData.append('customerId', String(this.customerIdService.customerId));
    formData.append(
      'employeeId',
      String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
    );
    formData.append('customerId', String(dto.customerId));
    if (dto.pathImage) {
      formData.append('pathImage', dto.pathImage);
    }

    return formData;
  }
  // get f() {
  //   return this.form.controls;
  // }
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ pathImage: file });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
