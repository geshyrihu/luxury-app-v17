import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-presentacion-junta-comite',
  templateUrl: './addoredit-presentacion-junta-comite.component.html',
  standalone: true,
  imports: [ComponentsModule, ReactiveFormsModule],
  providers: [CustomToastService],
})
export default class AddoreditPresentacionJuntaComiteComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  private customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';
  errorMessage: string = '';

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    archivo: [''],
    userId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    area: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form.patchValue({ area: this.config.data.titulo });
  }

  change(file: any) {
    this.form.patchValue({ archivo: file });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(`PresentacionJuntaComite/AddFile`, model)
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

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('userId', dto.userId);
    formData.append('area', String(dto.area));
    if (dto.archivo) {
      formData.append('archivo', dto.archivo);
    }
    return formData;
  }
}
