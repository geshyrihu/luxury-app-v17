import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { NgxMaskModule } from 'ngx-mask';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ERelationEmployee } from 'src/app/core/enums/relation-employee.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-person-emergency-contact',
  templateUrl: './addoredit-person-emergency-contact.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, NgxMaskModule],
  providers: [MessageService, ConfirmationService, CustomToastService],
})
export default class AddoreditPersonEmergencyContactComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  messageService = inject(MessageService);
  ref = inject(DynamicDialogRef);

  id: string = '';

  cb_persons: ISelectItem[] = [];
  cb_relacion: ISelectItem[] = onGetSelectItemFromEnum(ERelationEmployee);
  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup = this.formBuilder.group({
    id: { value: this.config.data.id, disabled: true },
    personId: [this.config.data.personId],
    namePerson: ['', Validators.required],
    personContactId: ['', Validators.required],
    relacion: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadSelectItem();
    if (this.id != '') {
      this.onLoadData();
    }
  }
  onLoadSelectItem() {
    this.apiRequestService.onGetSelectItem(`persons`).then((response: any) => {
      this.cb_persons = response;
    });
  }

  onLoadData() {
    this.dataService
      .get(`personemergencycontact/${this.id}`)
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

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === '') {
      this.dataService
        .post(`personemergencycontact`, this.form.value)
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
        .put(`personemergencycontact/${this.id}`, this.form.value)
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

  savePersonId(e: any) {
    let find = this.cb_persons.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      personContactId: find?.value,
      namePerson: find?.label,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
