import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { ETipoBaja } from 'src/app/core/enums/tipo-baja.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-solicitud-baja',
  templateUrl: './solicitud-baja.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CustomInputModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
    NgbAlertModule,
  ],
})
export default class SolicitudBajaComponent implements OnInit {
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dateService = inject(DateService);
  public ref = inject(DynamicDialogRef);

  data: any;
  id: number = 0;
  submitting: boolean = false;
  subRef$: Subscription;
  employeeId: number = this.config.data.employeeId;

  cb_type_departure: ISelectItemDto[] = onGetSelectItemFromEnum(ETipoBaja);
  cb_si_no: ISelectItemDto[] = cb_ESiNo;
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
  });

  ngOnInit(): void {
    this.onLoadData();
    // Suscribirse a cambios en el control 'typeOfDeparture'
    this.form.get('typeOfDeparture').valueChanges.subscribe((newValue) => {
      console.log('Nuevo valor:', newValue); // Puedes realizar acciones aquí cuando cambie el valor
      // Por ejemplo, puedes llamar a una función para manejar el cambio de valor
      this.handleValueChange(newValue);
    });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestDismissal/GetRequestDismissal/${this.employeeId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    var model = this.createFormData(this.form.value);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(
        `solicitudesreclutamiento/solicitudbaja/ 
          ${this.customerIdService.getcustomerId()}/${this.employeeId}/${
          this.authService.infoUserAuthDto.applicationUserId
        }`,
        model
      )
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

    // Aquí puedes hacer lo que desees con el objeto `solicitud`
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
    // ...

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

export interface SolicitudBajaDto {
  profession: number;
  executionDate: string;
  employee: number;
  phoneEmployee: string;
  typeOfDeparture: string;
  reasonForLeaving: string;
  discountDescription: DiscountDescription[];
  supportFiles: File[];
  lawyerAssistance: boolean;
  employeeInformed: boolean;
}

export interface DiscountDescription {
  enviar: true;
  description: string;
  price: number;
}
