import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-create-account-customer',
  templateUrl: './create-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
    PrimeNgModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class CreateAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  cb_profession: ISelectItemDto[] = [];
  cb_customer: ISelectItemDto[] = [];
  subRef$: Subscription;

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
    this.subRef$ = this.selectItemService
      .onGetSelectItem('customers')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_customer = items;
      });
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .post('Auth/CreateAccount', this.form.value)
      .subscribe({
        next: () => {
          this.ref.close(true);
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
