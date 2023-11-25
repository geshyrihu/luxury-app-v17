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
import { EStatus } from 'src/app/core/enums/status.enum';
import { ETurnoTrabajo } from 'src/app/core/enums/turno-trabajo.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IWorkPositionAddOrEditDto } from 'src/app/core/interfaces/IEmpresaOrganigramaAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
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
  selector: 'app-addoredit-plantilla',
  templateUrl: './addoredit-plantilla.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditPlantillaComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  submitting: boolean = false;

  id: number = 0;
  checked: boolean = false;
  cb_profession: ISelectItemDto[] = [];
  cb_employee: ISelectItemDto[] = [];
  cb_turnoTrabajo: ISelectItemDto[] = onGetSelectItemFromEnum(ETurnoTrabajo);
  cb_state: ISelectItemDto[] = onGetSelectItemFromEnum(EStatus);

  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get<IWorkPositionAddOrEditDto>(`WorkPosition/GetForEdit/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          this.form.patchValue({
            id: this.id,
          });
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
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
      this.subRef$ = this.dataService
        .post(`WorkPosition`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
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
        .put(`WorkPosition/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
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

  onProfessionSelectItem() {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(`Employee/${this.customerIdService.getcustomerId()}`)
      .subscribe((resp) => {
        this.cb_employee = resp;
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
