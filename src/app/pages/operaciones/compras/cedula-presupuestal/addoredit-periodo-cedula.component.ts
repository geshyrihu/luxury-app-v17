import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-periodo-cedula',
  templateUrl: './addoredit-periodo-cedula.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AddoreditPeriodoCedulaPresupuestalComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  private formBuilder = inject(FormBuilder);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    desde: ['', Validators.required],
    hasta: ['', Validators.required],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    customerId: [],
  });

  ngOnInit() {
    this.id = this.config.data.cedulaId;
    this.onLoadItem();
  }
  onLoadItem() {
    this.subRef$ = this.dataService
      .get<any>(`CedulaPresupuestal/GetCedulaPresuppuestal/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    const cedulaDto: any = this.form.value;
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
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`CedulaPresupuestal`, cedulaDto)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`CedulaPresupuestal/Actualizar/${this.id}`, cedulaDto)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
          },
        });
    }
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
