import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EHabitant } from 'src/app/core/enums/habitant.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-condominos',
  templateUrl: './addoredit-condominos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditCondominosComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;
  customerId: number = this.customerIdService.customerId;
  cb_directory_condominium: any[] = [];
  cb_enviarMails: ISelectItemDto[] = [
    {
      label: 'Sí',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];
  cb_Habitant: ISelectItemDto[] = onGetSelectItemFromEnum(EHabitant);
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerId],
    cellPhone: ['', Validators.required],
    directoryCondominiumId: ['', Validators.required],
    directoryCondominium: ['', Validators.required],
    extencion: [''],
    fixedPhone: [''],
    habitant: ['', Validators.required],
    mail: [''],
    nameDirectoryCondominium: ['', Validators.required],
    enviarMails: [],
    user: [''],
  });

  ngOnInit(): void {
    this.customerId = this.customerIdService.customerId;
    this.selectItemService
      .onGetSelectItem(
        `DirectoryCondominium/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp) => {
        this.cb_directory_condominium = resp;
      });

    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.getImem();
    }
  }

  public savePropiedadId(e): void {
    let find = this.cb_directory_condominium.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      directoryCondominiumId: find?.value,
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`ListCondomino/`, this.form.value)
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
        .put(`ListCondomino/${this.id}`, this.form.value)
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
  getImem() {
    this.dataService
      .get(`ListCondomino/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);

        this.form.patchValue({
          directoryCondominium: resp.body.directoryCondominium,
        });
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
