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
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-formato',
  templateUrl: './addoredit-formato.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditFormatoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  id: number = 0;

  errorMessage: string = '';
  file: any = null;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_area_responsable: ISelectItemDto[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    folio: ['', Validators.required],
    descripcion: ['', Validators.required],
    pathFormato: [''],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.onLoadSelectItem();
    this.form.patchValue({ area: this.config.data.titulo });
    this.dataService
      .get(`Formato/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  public saveAreResponsableId(e: any): void {
    let find = this.cb_area_responsable.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      responsibleAreaId: find?.value,
    });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    const model = this.onCreateFormData(this.form.value);
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`Formato`, model)
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
        .put(`Formato/${this.id}`, model)
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
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('folio', String(dto.folio));
    formData.append('descripcion', dto.descripcion);
    formData.append('pathFormato', String(dto.pathFormato));
    if (this.file != null) {
      formData.append('pathFormato', this.file);
    }
    return formData;
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('ResponsibleArea')
      .subscribe((resp) => {
        this.cb_area_responsable = resp;
      });
  }
}
