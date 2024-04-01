import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDirectoryCondominiumAddOrEdit } from 'src/app/core/interfaces/directory-condominium-add-or-edit.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-propiedades',
  templateUrl: './addoredit-propiedades.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditPropiedadesComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  private customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: number = 0;
  customerId: number = this.customerIdService.customerId;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    department: ['', Validators.required],
    customerId: [this.customerId, Validators.required],
    tower: ['', Validators.required],
    user: [''],
  });

  ngOnInit(): void {
    this.customerId = this.customerIdService.customerId;
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.getImem();
    }
  }
  submit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post<IDirectoryCondominiumAddOrEdit>(
          `DirectoryCondominium/`,
          this.form.value
        )
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
        .put<IDirectoryCondominiumAddOrEdit>(
          `DirectoryCondominium/${this.id}`,
          this.form.value
        )
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
      .get<IDirectoryCondominiumAddOrEdit>(`DirectoryCondominium/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
