import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ETypePiscina } from 'src/app/core/enums/type-piscina.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';
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

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.dataService
      .get(`piscina/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.model = resp.body;
        this.urlBaseImg = `${
          environment.base_urlImg
        }customers/${this.customerIdService.getcustomerId()}/piscina/`;
        this.form.patchValue(resp.body);
      });
  }

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;
    const formDataDto = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post('piscina', formDataDto)
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
        .put(`piscina/${this.id}`, formDataDto)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
