import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EState } from 'src/app/core/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-entrega-recepcion-cliente',
  templateUrl: './addoredit-entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, CustomInputModule],
  providers: [CustomToastService],
})
export default class CrudEntregaRecepcionClienteComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);
  private enumService = inject(EnumService);

  id: number = 0;
  subRef$: Subscription;

  cb_estatus: ISelectItemDto[] = onGetSelectItemFromEnum(EState);
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    observaciones: [''],
    archivo: [''],
    estatus: [EState.Activo],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
  });

  submitting: boolean = false;

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadData();
  }

  onSubmit() {
    this.id = this.config.data.id;
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    const model = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put(
        `EntregaRecepcionCliente/${this.id}/${
          this.authService.userTokenDto.infoEmployeeDto.employeeId
        }/${this.customerIdService.getcustomerId()}`,
        model
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
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
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`EntregaRecepcionDescripcion/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  change(file: any) {
    this.form.patchValue({ archivo: file });
    this.submitting = true;
  }
  get f() {
    return this.f.form.controls;
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('estatus', String(dto.estatus));
    formData.append('userId', dto.userId);
    formData.append('observaciones', String(dto.observaciones));
    if (dto.archivo) {
      formData.append('archivo', dto.archivo);
    }
    return formData;
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
