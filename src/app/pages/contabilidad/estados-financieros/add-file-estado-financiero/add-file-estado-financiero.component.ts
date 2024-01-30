import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import ComponentsModule from 'app/shared/components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-add-file-estado-financiero',
  templateUrl: './add-file-estado-financiero.component.html',
  standalone: true,
  imports: [ComponentsModule, ReactiveFormsModule],
  providers: [CustomToastService],
})
export default class AddFileEstadoFinancieroComponent
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
    nameFileEstadoFinanciero: [''],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
  }

  change(file: any) {
    this.form.patchValue({ nameFileEstadoFinanciero: file });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(
        `EstadoFinanciero/UploadFile/${this.id}/${this.authService.infoEmployeeDto.personId}`,
        model
      )
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

  onCreateFormData(dto: any) {
    let formData = new FormData();
    if (dto.nameFileEstadoFinanciero) {
      formData.append('nameFileEstadoFinanciero', dto.nameFileEstadoFinanciero);
    }
    return formData;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
