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
  subRef$: Subscription;
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
    console.log(
      '🚀 ~ file: addoredit-formato.component.ts:61 ~ AddOrEditFormatoComponent ~ this.subRef$=this.dataService.get ~ this.id:',
      this.id
    );
    this.onLoadSelectItem();

    this.form.patchValue({ area: this.config.data.titulo });
    this.subRef$ = this.dataService.get(`Formato/${this.id}`).subscribe({
      next: (resp: any) => {
        this.form.patchValue(resp.body);
      },
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    const model = this.onCreateFormData(this.form.value);
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService.post(`Formato`, model).subscribe({
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
        .put(`Formato/${this.id}`, model)
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
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
