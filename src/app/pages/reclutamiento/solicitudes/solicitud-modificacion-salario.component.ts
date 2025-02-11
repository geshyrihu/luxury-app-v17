import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EnumSelectService } from '../../../core/services/enum-select.service';

@Component({
    selector: 'app-solicitud-modificacion-salario',
    templateUrl: './solicitud-modificacion-salario.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule, FileUploadModule],
    providers: [EnumSelectService]
})
export default class SolicitudModificacionSalarioComponent {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);
  enumSelectS = inject(EnumSelectService);

  workPositionId: number = this.config.data.workPositionId;
  data: any;
  submitting: boolean = false;

  id: number = 0;

  cb_profession: ISelectItem[] = [];
  cb_si_no: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    employeeId: ['', Validators.required],
    employeeName: ['', Validators.required],
    professionCurrentId: [],
    professionCurrent: [],
    professionNewId: [],
    professionNew: [],
    currentSalary: ['', Validators.required],
    finalSalary: ['', [Validators.required, Validators.min(1)]],
    executionDate: ['', Validators.required],
    retroactive: [false, Validators.required],
    additionalInformation: [''],
  });

  async ngOnInit() {
    this.cb_si_no = await this.enumSelectS.boolYesNo();
    this.apiRequestS.onGetSelectItem(`Professions`).then((response: any) => {
      this.cb_profession = response;
    });

    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `RequestSalaryModification/GetDataForModificacionSalario/${this.workPositionId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    var model = this.createFormData(this.form.value);

    this.submitting = true;

    this.apiRequestS
      .onPost(
        `SolicitudesReclutamiento/SolicitudModificacionSalario/${this.customerIdS.getCustomerId()}/${
          this.authS.infoUserAuthDto.applicationUserId
        } `,
        model
      )
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
  createFormData(form: any) {
    const formData = new FormData();

    if (this.filesForm.value.files != null) {
      for (var i = 0; i < this.filesForm.value.files.length; i++) {
        formData.append('soport', this.filesForm.value.files[i]);
      }
    }

    formData.append('employeeId', form.employeeId);
    formData.append('currentSalary', form.currentSalary);
    formData.append('professionCurrent', form.professionCurrent);
    formData.append('professionCurrentId', form.professionCurrentId);
    formData.append('professionNewId', form.professionNewId);
    formData.append('professionNew', form.professionNew);
    formData.append('employeeName', form.employeeName);
    formData.append('finalSalary', form.finalSalary);
    formData.append('workPositionId', this.config.data.workPositionId);
    formData.append(
      'executionDate',
      this.dateS.getDateFormat(form.executionDate)
    );
    formData.append('retroactive', form.retroactive);
    formData.append('additionalInformation', form.additionalInformation);

    return formData;
  }
  isControlInvalid(control: FormControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  //Carga de archivos....

  /**CARGA DRAG AND DROB */

  private filesControl = new FormControl<File[]>(
    null,
    FileUploadValidators.fileSize(20000)
  );

  public filesForm = new FormGroup({
    files: this.filesControl,
  });

  /**CARGA DRAG AND DROB */
  maxSizeExceeded: boolean = false;
  onFileChange() {
    this.maxSizeExceeded = false;
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    let sizeFile = 0;
    if (this.filesForm.value.files != null) {
      for (var i = 0; i < this.filesForm.value.files.length; i++) {
        sizeFile = sizeFile + this.filesForm.value.files[i].size;
      }
    }
    if (sizeFile > maxFileSize) this.maxSizeExceeded = true;
  }

  public onSaveProfessionIdToAccount(e: any): void {
    let find = this.cb_profession.find(
      (x) => x.label.toLowerCase() === e.target.value.toLowerCase()
    );

    this.form.patchValue({
      professionNewId: find?.value,
      professionNew: find?.label,
    });
  }
}
