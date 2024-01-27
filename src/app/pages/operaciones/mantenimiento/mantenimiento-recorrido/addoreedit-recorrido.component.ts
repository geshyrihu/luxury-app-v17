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
import { ERouteRecurrence } from 'src/app/core/enums/route-recurrence.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-recorrido',
  templateUrl: './addoreedit-recorrido.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class RecorridoAddOrEditComponent implements OnInit, OnDestroy {
  public selectItemService = inject(SelectItemService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup;
  id: number = 0;
  cb_machinery: ISelectItemDto[] = [];
  idMachinery: number = null;
  // cb_RouteRecurrence: ISelectItemDto[] = [];
  cb_RouteRecurrence: ISelectItemDto[] =
    onGetSelectItemFromEnum(ERouteRecurrence);

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp: any) => {
        this.cb_machinery = resp;
      });
  }

  public saveMachineryId(e): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.onLoadSelectItem();
    this.onLoadForm();
  }

  onLoadData() {
    this.dataService
      .get('Routes/' + this.id)
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

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      position: ['', Validators.required],
      routeRecurrence: [0, Validators.required],
    });
  }

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`Routes`, this.form.value)
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
        .put(`Routes/${this.id}`, this.form.value)
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
  createModel(form: any) {
    return {
      machineryId: form.machineryId.value,
      position: form.position,
      routeRecurrence: form.routeRecurrence,
    };
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
