import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-control-prestamo-herramienta',
  templateUrl: './form-control-prestamo-herramienta.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class FormControlPrestamoHerramientaComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;
  cb_employee: any[] = [];
  cb_tool: any[] = [];
  today: string = '';
  form: FormGroup;

  ngOnInit(): void {
    this.selectItemService
      .onGetSelectItem(`Employee/${this.customerIdService.getcustomerId()}`)
      .subscribe((resp) => {
        this.cb_employee = resp;
      });
    this.selectItemService
      .onGetSelectItem(`tool/${this.customerIdService.getcustomerId()}`)
      .subscribe((resp) => {
        this.cb_tool = resp;
      });
    this.today = new Date().toISOString().slice(0, 16);
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerIdService.customerId],
      fechaSalida: [this.today, Validators.required],
      fechaRegreso: [],
      employeeId: ['', Validators.required],
      employee: ['', Validators.required],
      toolId: ['', Validators.required],
      tool: ['', Validators.required],
      observaciones: [],
      employeeResponsableId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
      ],
    });
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  public saveToolId(e): void {
    let find = this.cb_tool.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      toolId: find?.value,
    });
  }
  public saveEmployeeId(e): void {
    let find = this.cb_employee.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeId: find?.value,
    });
  }
  get f() {
    return this.form.controls;
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`ControlPrestamoHerramientas/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
        this.form.patchValue({
          employee: resp.body.employee,
        });
        this.form.patchValue({
          employeeId: resp.body.employeeId,
        });
        this.form.patchValue({
          tool: resp.body.tool,
        });
        this.form.patchValue({
          toolId: resp.body.toolId,
        });
      });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`ControlPrestamoHerramientas`, this.form.value)
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
    } else {
      this.subRef$ = this.dataService
        .put(`ControlPrestamoHerramientas/${this.id}`, this.form.value)
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
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
