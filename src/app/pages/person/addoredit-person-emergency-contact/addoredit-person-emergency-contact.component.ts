import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ERelationEmployee } from 'src/app/core/enums/relation-employee.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-person-emergency-contact',
  templateUrl: './addoredit-person-emergency-contact.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
    FormsModule,
    ToastModule,
    NgxMaskModule,
  ],
  providers: [MessageService, ConfirmationService, CustomToastService],
})
export default class AddoreditPersonEmergencyContactComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  id: string = '';

  cb_persons: ISelectItemDto[] = [];
  cb_relacion: ISelectItemDto[] = onGetSelectItemFromEnum(ERelationEmployee);
  submitting: boolean = false;
  subRef$: Subscription;

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
    // Carga de listado de personas
    this.selectItemService.onGetSelectItem('persons').subscribe((resp) => {
      this.cb_persons = resp;
    });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`personemergencycontact/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          console.log('🚀 ~ resp.body:', resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    console.log('🚀 ~ fomulario:', this.form.value);

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === '') {
      this.subRef$ = this.dataService
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
      this.subRef$ = this.dataService
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
    console.log('🚀 ~ this.form.invalid:', this.form.value);
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
