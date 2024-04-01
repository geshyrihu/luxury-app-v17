import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EState } from 'src/app/core/enums/state.enum';
import { ETurnoTrabajo } from 'src/app/core/enums/turno-trabajo.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IWorkPositionAddOrEdit } from 'src/app/core/interfaces/empresa-organigrama-add-or-edit.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-addoredit-plantilla',
  templateUrl: './addoredit-plantilla.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditPlantillaComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;
  checked: boolean = false;
  cb_profession: ISelectItem[] = [];
  cb_employee: ISelectItem[] = [];
  cb_turnoTrabajo: ISelectItem[] = onGetSelectItemFromEnum(ETurnoTrabajo);
  cb_state: ISelectItem[] = onGetSelectItemFromEnum(EState);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getcustomerId(), Validators.required],
    folio: [''],
    professionId: ['', Validators.required],
    responsibleAreaId: [''],
    professionName: [''],
    sueldo: [0.0],
    sueldoBase: [0.0, Validators.required],
    state: [0, Validators.required],
    employeeId: [null],
    employeeName: [''],
    turnoTrabajo: [0],
    lunesEntrada: [''],
    lunesSalida: [''],
    martesEntrada: [''],
    martesSalida: [''],
    miercolesEntrada: [''],
    miercolesSalida: [''],
    juevesEntrada: [''],
    juevesSalida: [''],
    viernesEntrada: [''],
    viernesSalida: [''],
    sabadoEntrada: [''],
    sabadoSalida: [''],
    domingoEntrada: [''],
    domingoSalida: [''],
    observationsWorkShift: [''],
  });

  ngOnInit(): void {
    this.onProfessionSelectItem();
    this.onProfessionSelectItem();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get<IWorkPositionAddOrEdit>(`WorkPosition/GetForEdit/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          this.form.patchValue({
            id: this.id,
          });
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.form.patchValue({
      professionName: '',
      employeeName: '',
    });
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`WorkPosition`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`WorkPosition/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  onProfessionSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`Employee/${this.customerIdService.getcustomerId()}`)
      .then((response: any) => {
        this.cb_employee = response;
      });
  }
  public saveemployeeIdId(e: any): void {
    let find = this.cb_employee.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeId: find?.value,
    });
  }
  public saveprofessionIdId(e): void {
    let find = this.cb_profession.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
    });
  }
}
