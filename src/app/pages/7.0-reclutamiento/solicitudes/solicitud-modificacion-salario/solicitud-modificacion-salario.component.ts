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
import { Subject, takeUntil } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-modificacion-salario',
  templateUrl: './solicitud-modificacion-salario.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, FileUploadModule],
})
export default class SolicitudModificacionSalarioComponent {
  dataService = inject(DataConnectorService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  customToastService = inject(CustomToastService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  workPositionId: number = this.config.data.workPositionId;
  data: any;
  submitting: boolean = false;

  id: number = 0;

  cb_profession: ISelectItem[] = [];
  cb_si_no: ISelectItem[] = cb_ESiNo;

  form: FormGroup = this.formBuilder.group({
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

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });

    this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(
        `RequestSalaryModification/GetDataForModificacionSalario/${this.workPositionId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    var model = this.createFormData(this.form.value);

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(
        `SolicitudesReclutamiento/SolicitudModificacionSalario/${this.customerIdService.getCustomerId()}/${
          this.authS.infoUserAuthDto.applicationUserId
        } `,
        model
      )
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

    // Aquí puedes hacer lo que desees con el objeto `solicitud`
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
      this.dateService.getDateFormat(form.executionDate)
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
