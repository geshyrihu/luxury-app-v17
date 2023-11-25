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
import { CedulaPresupuestalDetalleAddOrEdit } from 'src/app/core/interfaces/ICedulaPresupuestalDetalleAddOrEdit.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-edit-partida-cedula',
  templateUrl: './edit-partida-cedula.component.html',
  standalone: true,
  imports: [ComponentsModule, ReactiveFormsModule, CustomInputModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class EditPartidaCedulaComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  subRef$: Subscription;

  applicationUserId: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  id: any = 0;
  form: FormGroup;

  ngOnInit() {
    this.id = this.config.data.id;
    this.onLoadData();
  }

  onSubmit() {
    const budgetCardDTO: CedulaPresupuestalDetalleAddOrEdit = this.form.value;
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
        .post(`CedulaPresupuestalDetalles`, budgetCardDTO)
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
        .put(`CedulaPresupuestalDetalles/${this.id}`, budgetCardDTO)
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
  onLoadData() {
    this.form = this.formBuilder.group({
      id: [this.id],
      cuentaId: [0],
      cedulaPresupuestalId: [''],
      descripcion: [''],
      presupuestoMensual: [0, Validators.required],
      applicationUserId: [''],
      presupuestoEjercido: [],
    });
    this.subRef$ = this.dataService
      .get(`CedulaPresupuestalDetalles/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          this.form.patchValue({
            descripcion: resp.body.cuenta.descripcion,
          });
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
