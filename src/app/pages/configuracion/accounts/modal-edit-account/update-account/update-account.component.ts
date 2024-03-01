import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IEditarCuentaDto } from 'src/app/core/interfaces/IEditarCuentaDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class UpdateAccountComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);

  cb_customer: ISelectItemDto[] = [];
  cb_employee: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[] = [];
  submitting: boolean = false;

  @Input()
  applicationUserId: string = '';

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
    const urlRle = !this.authService.onValidateRoles(['SuperUsuario'])
      ? `getallemployeeactive/${this.customerIdService.getcustomerId()}`
      : 'getallemployeeactive';

    this.apiRequestService
      .onGetSelectItem(urlRle)
      .then((response: ISelectItemDto[]) => {
        this.cb_employee = response;
      });

    this.apiRequestService
      .onGetSelectItem('customers')
      .then((response: ISelectItemDto[]) => {
        this.cb_customer = response;
      });

    this.apiRequestService
      .onGetSelectItem('professions')
      .then((response: ISelectItemDto[]) => {
        this.cb_profession = response;
      });
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(`accounts/getapplicationuser/${this.applicationUserId}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          employeeActualId: result.employeeId,
        });
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.form.patchValue({
      personName: '',
    });

    this.apiRequestService
      .onPut<IEditarCuentaDto>(
        `accounts/updateapplicationuser/${this.applicationUserId}`,
        this.form.value
      )
      .then(() => {
        this.onLoadData();
        this.submitting = false;
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
}
