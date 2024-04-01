import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EPosicionComite } from 'src/app/core/enums/position.comite.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IComiteVigilanciaAddOrEdit } from 'src/app/core/interfaces/comite-vigilancia-add-or-edit.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-addoredit-comite-vigilancia',
  templateUrl: './addoredit-comite-vigilancia.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditComiteVigilanciaComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

  cb_position: ISelectItem[] = onGetSelectItemFromEnum(EPosicionComite);
  cb_condomino: ISelectItem[] = [];
  id: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    listCondominoId: ['', Validators.required],
    nameDirectoryCondominium: ['', Validators.required],
    ePosicionComite: [0, [Validators.required]],
    customerId: [],
  });

  //

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(
        `ListCondomino/${this.customerIdService.getcustomerId()}`
      )
      .then((response: any) => {
        this.cb_condomino = response;
      });

    this.form.patchValue({
      customerId: this.customerIdService.getcustomerId(),
    });

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  public saveCondominoId(e): void {
    let find = this.cb_condomino.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      listCondominoId: find?.value,
    });
  }

  onLoadData() {
    this.dataService
      .get<IComiteVigilanciaAddOrEdit>(`ComiteVigilancia/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`ComiteVigilancia`, this.form.value)
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
        .put(`ComiteVigilancia/${this.id}`, this.form.value)
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
}
