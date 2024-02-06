import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-create-account-customer',
  templateUrl: './create-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CreateAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public ref = inject(DynamicDialogRef);
  public apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;

  cb_profession: ISelectItemDto[] = [];
  cb_customer: ISelectItemDto[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup = this.formBuilder.group({
    userName: ['', Validators.required],
    email: [''],
    phoneNumber: [''],
    professionId: ['', Validators.required],
    customerId: ['', Validators.required],
  });

  ngOnInit() {
    this.onLoadSelectItem();
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('customers')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_customer = items;
      });
    this.selectItemService
      .onGetSelectItem('Professions')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_profession = resp;
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.dataService
      .post('Auth/CreateAccount', this.form.value)
      .pipe(
        takeUntil(this.destroy$), // Cancelar la suscripción cuando el componente se destruye
        finalize(() => {
          // Habilitar el botón al finalizar el envío del formulario
          this.submitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
