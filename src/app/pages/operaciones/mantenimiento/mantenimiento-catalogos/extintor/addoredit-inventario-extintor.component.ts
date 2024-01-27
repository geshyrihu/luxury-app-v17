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
import { EExtintor } from 'src/app/core/enums/extintor.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IInventarioExtintorDto } from 'src/app/core/interfaces/IInventarioExtintorDto.interface';
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
  selector: 'app-addoredit-inventario-extintor',
  templateUrl: './addoredit-inventario-extintor.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditInventarioExtintorComponent
  implements OnInit, OnDestroy
{
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  cb_extintor: ISelectItemDto[] = onGetSelectItemFromEnum(EExtintor);
  urlBaseImg = `${environment.base_urlImg}customers/`;
  photoFileUpdate: boolean = false;
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getcustomerId(), Validators.required],
    eExtintor: ['', Validators.required],
    ubicacion: ['', Validators.required],
    photo: [''],
    employeeId: [],
  });

  uploadFile(file: any) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photo: file });
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get<IInventarioExtintorDto>(`InventarioExtintor/${this.id}`)
      .subscribe((resp: any) => {
        this.urlBaseImg = `${environment.base_urlImg}/customers/${resp.body.customerId}/extintor/${resp.body.photo}`;
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    this.form.patchValue({
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });
    if (!this.dataService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`InventarioExtintor`, formData)
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
        .put(`InventarioExtintor/${this.id}`, formData)
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
  private createFormData(dto: any): FormData {
    const formData = new FormData();
    formData.append('customerId', String(dto.customerId));
    formData.append('eExtintor', String(dto.eExtintor));
    formData.append('ubicacion', String(dto.ubicacion));
    formData.append(
      'employeeId',
      String(this.authService.userTokenDto.infoEmployeeDto.employeeId)
    );
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.photo) {
      formData.append('photo', dto.photo);
    }
    return formData;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
