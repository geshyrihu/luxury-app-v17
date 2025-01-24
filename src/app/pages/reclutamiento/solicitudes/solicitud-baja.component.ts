import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { ETipoBaja } from 'src/app/core/enums/tipo-baja.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-baja',
  templateUrl: './solicitud-baja.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, FileUploadModule],
})
export default class SolicitudBajaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  ref = inject(DynamicDialogRef);

  data: any;
  id: number = 0;
  submitting: boolean = false;

  employeeId: number = this.config.data.employeeId;

  cb_type_departure: ISelectItem[] = onGetSelectItemFromEnum(ETipoBaja);
  cb_si_no: ISelectItem[] = cb_ESiNo;
  tipobaja: ETipoBaja = ETipoBaja.Despido;
  mensajeRenuncia =
    'Adjunta la renuncia firmada por el empleado, si no regreso a firmar se considera abandono de trabajo';
  form: FormGroup = this.formBuilder.group({
    id: [this.config.data.employeeId],
    professionId: ['', Validators.required],
    employeeId: ['', Validators.required],
    profession: ['', Validators.required],
    professionKey: [],
    executionDate: ['', Validators.required],
    typeOfDeparture: ['', Validators.required],
    employee: ['', Validators.required],
    lastdayofwork: ['', Validators.required],
    phoneEmployee: ['', Validators.required],
    reasonForLeaving: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250),
      ],
    ],
    discountDescriptions: this.formBuilder.array([]),
    lawyerAssistance: false, // Valor booleano directo
    employeeInformed: false, // Valor booleano directo

    applicationUserRequestId: [this.authS.applicationUserId],
  });

  ngOnInit(): void {
    this.onLoadData();
    // Suscribirse a cambios en el control 'typeOfDeparture'
    this.form.get('typeOfDeparture').valueChanges.subscribe((newValue) => {
      // Por ejemplo, puedes llamar a una función para manejar el cambio de valor
      this.handleValueChange(newValue);
    });
  }
  onLoadData() {
    const urlApi = `RequestDismissal/GetRequestDismissal/${this.employeeId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  handleValueChange(newValue: any) {
    if (newValue == 0) {
      // Hacer el campo de archivos obligatorio
      this.filesControl.setValidators([
        Validators.required,
        FileUploadValidators.fileSize(20000),
      ]);
    } else {
      // Eliminar la validación requerida si no se requiere
      this.filesControl.setValidators(FileUploadValidators.fileSize(20000));
    }

    this.tipobaja = newValue;

    // Actualizar la validez del control y su estado
    this.filesControl.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    var model = this.createFormData(this.form.value);

    this.submitting = true;

    this.apiRequestService
      .onPost(
        `SolicitudesReclutamiento/SolicitudBaja/
          ${this.custIdService.getCustomerId()}/${this.employeeId}/${
          this.authS.infoUserAuthDto.applicationUserId
        }`,
        model
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
  createFormData(form: any) {
    const formData = new FormData();

    if (this.filesForm.value.files != null) {
      for (var i = 0; i < this.filesForm.value.files.length; i++) {
        formData.append('supportFiles', this.filesForm.value.files[i]);
      }
    }
    formData.append('profession', form.profession);
    formData.append(
      'executionDate',
      this.dateService.getDateFormat(form.executionDate)
    );
    formData.append(
      'lastdayofwork',
      this.dateService.getDateFormat(form.lastdayofwork)
    );
    formData.append('typeOfDeparture', form.typeOfDeparture);
    formData.append('professionId', form.professionId);
    formData.append('employeeId', form.employeeId);
    formData.append('professionKey', form.professionKeyure);
    formData.append('employee', form.employee);
    formData.append('phoneEmployee', form.phoneEmployee);
    formData.append('reasonForLeaving', form.reasonForLeaving);
    formData.append('lawyerAssistance', form.lawyerAssistance.toString());
    formData.append('employeeInformed', form.employeeInformed.toString());
    formData.append(
      'applicationUserRequestId',
      this.authS.applicationUserId.toString()
    );

    const discountDescriptions = form.discountDescriptions;
    for (let i = 0; i < discountDescriptions.length; i++) {
      const discountDescription = discountDescriptions[i];
      formData.append(
        `discountDescription[${i}].description`,
        discountDescription.description
      );
      formData.append(
        `discountDescription[${i}].price`,
        discountDescription.price.toString()
      );
    }

    // ...

    return formData;
  }

  isControlInvalid(control: AbstractControl | null): boolean {
    if (control instanceof FormControl) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  addDiscountDescription() {
    const discountDescription = this.formBuilder.group({
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.discountDescriptions.push(discountDescription);
  }

  removeDiscountDescription(index: number) {
    this.discountDescriptions.removeAt(index);
  }

  get discountDescriptions() {
    return this.form.get('discountDescriptions') as FormArray;
  }

  //Carga de archivos....

  /**CARGA DRAG AND DROB */

  filesControl = new FormControl<File[]>(
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
    if (sizeFile > maxFileSize) {
      this.maxSizeExceeded = true;
    } else {
      // Si el tamaño del archivo está dentro del límite, y se ha seleccionado algún archivo
      // puedes marcar el control como válido
      if (this.filesForm.value.files && this.filesForm.value.files.length > 0) {
        this.filesControl.setErrors(null);
      }
    }
  }
}
