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
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-contrato-poliza',
  templateUrl: './addoredit-contrato-poliza.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditContratoPolizaComponent
  implements OnInit, OnDestroy
{
  private serviceIdCustomer = inject(CustomerIdService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public selectItemService = inject(SelectItemService);
  public ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: number = 0;
  urlBaseImg = environment.base_urlImg;
  model: any;
  cb_providers: ISelectItemDto[] = [];
  file: File;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    providerId: ['', Validators.required],
    providerName: ['', Validators.required],
    customerId: [this.serviceIdCustomer.getcustomerId(), Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    document: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.selectItemService
      .onGetSelectItem('Providers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_providers = resp;
      });

    flatpickrFactory();
    if (this.id !== 0) this.onLoadData();
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadData() {
    this.dataService
      .get(`ContratoPoliza/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.id = resp.body.id;
        this.form.patchValue(resp.body);
        this.form.patchValue({
          providerId: resp.body.providerId,
        });
        this.form.patchValue({
          providerName: resp.body.providerName,
        });
      });
  }
  submit() {
    let formData = this.createModel(this.form);

    if (!this.dataService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`ContratoPoliza`, formData)
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
        .put(`ContratoPoliza/${this.id}`, formData)
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

  uploadFile(event) {
    this.file = event.target.files[0];
  }
  createModel(form: FormGroup): FormData {
    const formData = new FormData();
    if (this.file !== undefined) {
      formData.append('document', this.file);
    }

    formData.append('providerId', String(form.get('providerId').value));
    formData.append('customerId', String(form.get('customerId').value));
    formData.append('description', form.get('description').value);
    formData.append(
      'startDate',
      this.dateService.getDateFormat(form.get('startDate').value)
    );
    formData.append(
      'endDate',
      this.dateService.getDateFormat(form.get('endDate').value)
    );

    return formData;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
