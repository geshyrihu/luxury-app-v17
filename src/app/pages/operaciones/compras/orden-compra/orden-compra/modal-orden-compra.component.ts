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
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-modal-orden-compra',
  templateUrl: './modal-orden-compra.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ModalOrdenCompraComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  subRef$: Subscription;

  ordenCompraId: number = 0;
  model: any;
  form: FormGroup = this.formBuilder.group({
    id: [0, Validators.required],
    fechaSolicitud: ['', Validators.required],
    equipoOInstalacion: ['', Validators.required],
    justificacionGasto: ['', Validators.required],
    urlFile: [''],
    applicationUserId: [''],
    folio: [''],
    folioSolicitudCompra: [''],
    customerId: [0],
    employeeid: [this.authService.infoEmployeeDto.employeeId],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.ordenCompraId = this.config.data.ordenCompra.id;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`OrdenCompra/GetForEdit/${this.ordenCompraId}`)
      .subscribe((resp: any) => {
        console.log('🚀 ~ resp.body:', resp.body);
        resp.body.fechaSolicitud = this.dateService.getDateFormat(
          resp.body.fechaSolicitud
        );
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
