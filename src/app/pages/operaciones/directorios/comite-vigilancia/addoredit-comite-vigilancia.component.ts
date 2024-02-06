import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EPosicionComite } from 'src/app/core/enums/position.comite.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IComiteVigilanciaAddOrEditDto } from 'src/app/core/interfaces/IComiteVigilanciaAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
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
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  public customerIdService = inject(CustomerIdService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

  cb_position: ISelectItemDto[] = onGetSelectItemFromEnum(EPosicionComite);
  cb_condomino: ISelectItemDto[] = [];
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
    this.selectItemService
      .onGetSelectItem(
        `ListCondomino/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp) => {
        this.cb_condomino = resp;
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
      .get<IComiteVigilanciaAddOrEditDto>(`ComiteVigilancia/${this.id}`)
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
