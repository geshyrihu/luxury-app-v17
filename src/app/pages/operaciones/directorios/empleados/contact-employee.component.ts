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
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-contact-employee',
  templateUrl: './contact-employee.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    ToastModule,
    NgxMaskModule,
  ],
  providers: [MessageService, ConfirmationService, CustomToastService],
})
export default class ContactEmployeeComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);

  id: number;
  idEmployee: number;
  cb_contactEmployee: ISelectItemDto[] =
    onGetSelectItemFromEnum(ERelationEmployee);
  showButtonAddOrCancel: boolean = false;
  contactEmployeeAdd: any;
  submitting: boolean = false;
  subRef$: Subscription;

  data: any[] = [];
  form: FormGroup;

  ngOnInit(): void {
    this.idEmployee = this.config.data.id;
    this.onLoadForm();
    this.getContactEmployees();
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      relacion: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      employeeId: [this.idEmployee, Validators.required],
    });
  }

  getContactEmployees() {
    this.subRef$ = this.dataService
      .get(`ContactEmployees/GetAsyncAll/${this.idEmployee}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onUpdate(item: any) {
    this.subRef$ = this.dataService
      .put(`ContactEmployees/${item.id}`, item)
      .subscribe((resp: any) => {
        this.customToastService.onShowSuccess();
        this.getContactEmployees();
      });
  }
  onDelete(item: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ContactEmployees/${item.id}`)
      .subscribe({
        next: () => {
          this.getContactEmployees();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  onSubmit() {
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

    this.subRef$ = this.dataService
      .post(`ContactEmployees`, this.form.value)
      .subscribe({
        next: () => {
          this.showButtonAddOrCancel = false;
          this.getContactEmployees();
          this.onLoadForm();
          this.customToastService.onCloseToSuccess();
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
