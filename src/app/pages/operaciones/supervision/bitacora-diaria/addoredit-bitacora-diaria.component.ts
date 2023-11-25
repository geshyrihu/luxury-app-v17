import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import {
  AuthService,
  CustomToastService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-bitacora-diaria',
  templateUrl: './addoredit-bitacora-diaria.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditBitacoraDiariaComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private selectItemService = inject(SelectItemService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private dateService = inject(DateService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;
  cb_customer: any[] = [];
  rangeDates: Date[];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    fechaSolicitud: [this.dateService.getDateNow(), Validators.required],
    customerId: [
      this.authService.userTokenDto.infoUserAuthDto.customerId,
      Validators.required,
    ],
    problema: ['', Validators.required],
    solucion: [''],
    fechaConclusion: [],
    employeeId: [
      this.authService.userTokenDto.infoEmployeeDto.employeeId,
      Validators.required,
    ],
  });

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('customers')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_customer = items;
      });
  }

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.id;
    this.onLoadSelectItem();
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`AgendaSupervision/${this.id}`)
      .subscribe((resp: any) => {
        resp.body.fechaConclusion = this.dateService.getDateFormat(
          resp.body.fechaConclusion
        );
        resp.body.fechaSolicitud = this.dateService.getDateFormat(
          resp.body.fechaSolicitud
        );
        this.form.patchValue(resp.body);
      });
  }

  submit() {
    this.form.patchValue({
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`AgendaSupervision/`, this.form.value)
        .subscribe({
          next: () => {
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
        .put(`AgendaSupervision/${this.id}`, this.form.value)
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
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
