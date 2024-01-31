import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { IEditarCuentaDto } from 'src/app/core/interfaces/IEditarCuentaDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    LuxuryAppComponentsModule,
    CustomInputModule,
    NgbModule,
    ReactiveFormsModule,
    ToastModule,
  ],
})
export default class UpdateAccountComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);

  cb_customer: ISelectItemDto[] = [];
  cb_employee: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[] = [];
  submitting: boolean = false;

  @Input()
  applicationUserId: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup = this.formBuilder.group({
    id: { value: this.applicationUserId, disabled: true },
    userName: ['', Validators.required],
    email: [''],
    professionId: ['', Validators.required],
    customerId: ['', Validators.required],
    phoneNumber: [''],
    personId: [''],
    personActualId: [''],
    personName: [''],
  });

  ngOnInit(): void {
    this.onLoadEmployee();
    this.onLoadData();
  }

  onLoadEmployee() {
    if (!this.authService.onValidateRoles(['SuperUsuario'])) {
      this.selectItemService
        .onGetSelectItem(
          `getallemployeeactive/${this.customerIdService.getcustomerId()}`
        )
        .subscribe((resp) => {
          this.cb_employee = resp;
        });
    } else {
      this.selectItemService
        .onGetSelectItem('getallemployeeactive')
        .subscribe((resp) => {
          this.cb_employee = resp;
        });
    }

    this.selectItemService
      .onGetSelectItem('customers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_customer = resp;
      });
    this.selectItemService
      .onGetSelectItem('professions')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_profession = resp;
      });
  }

  onLoadData() {
    this.dataService
      .get<IEditarCuentaDto>(
        `accounts/getapplicationuser/${this.applicationUserId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          this.form.patchValue({
            employeeActualId: resp.body.employeeId,
          });
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.form.patchValue({
      personName: '',
    });

    this.dataService
      .put<IEditarCuentaDto>(
        `accounts/updateapplicationuser/${this.applicationUserId}`,
        this.form.value
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.submitting = false;
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSaveEmployeeToAccount(e: any): void {
    let find = this.cb_employee.find(
      (x) => x.label.toLowerCase() === e.target.value.toLowerCase()
    );
    this.form.patchValue({
      personId: find?.value,
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
