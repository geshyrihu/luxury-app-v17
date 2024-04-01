import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IEditarCuenta } from 'src/app/core/interfaces/cuenta-edit.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class UpdateAccountComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);

  cb_customer: ISelectItem[] = [];
  cb_employee: ISelectItem[] = [];
  cb_profession: ISelectItem[] = [];
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
      .then((response: ISelectItem[]) => {
        this.cb_employee = response;
      });

    this.apiRequestService
      .onGetSelectItem('customers')
      .then((response: ISelectItem[]) => {
        this.cb_customer = response;
      });

    this.apiRequestService
      .onGetSelectItem('professions')
      .then((response: ISelectItem[]) => {
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
      .onPut<IEditarCuenta>(
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
