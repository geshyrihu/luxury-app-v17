import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-modal-orden-compra',
  templateUrl: './modal-orden-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
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

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

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
    this.dataService
      .get(`OrdenCompra/GetForEdit/${this.ordenCompraId}`)
      .subscribe((resp: any) => {
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

    this.dataService
      .put(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
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

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
