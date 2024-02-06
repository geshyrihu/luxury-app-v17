import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EEducationLevel } from 'src/app/core/enums/education-level.enum';
import { EMaritalStatus } from 'src/app/core/enums/marital.status';
import { ECountry } from 'src/app/core/enums/paises.enum';
import { ESex } from 'src/app/core/enums/sex.enum';
import { EBloodType } from 'src/app/core/enums/tipo-sangre';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { phonePrefixes } from 'src/app/core/interfaces/phone-number-prefix';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-person-data',
  templateUrl: './addoredit-person-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [DatePipe],
})
export default class AddoreditPersonDataComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public datepipe = inject(DatePipe);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  personId = 0;
  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_blood_type = onGetSelectItemFromEnum(EBloodType);
  cb_education_level = onGetSelectItemFromEnum(EEducationLevel);
  cb_marital_status = onGetSelectItemFromEnum(EMaritalStatus);
  cb_nationality = ECountry.GetEnum();
  cb_sex = onGetSelectItemFromEnum(ESex);
  cb_type_contract = onGetSelectItemFromEnum(ETypeContract);

  cb_profession: ISelectItemDto[];
  cb_phonePrefixes: any = phonePrefixes;
  cb_customer: ISelectItemDto[] = [];
  cb_state: ISelectItemDto[] = [];
  form: FormGroup;

  ngOnInit(): void {
    this.selectItemService
      .onGetSelectItem('Professions')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_profession = resp;
      });
    this.selectItemService
      .onGetSelectItem('Customers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_customer = resp;
      });

    flatpickrFactory();
    this.personId = this.config.data.personId;

    if (this.personId !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.personId, disabled: true },
      birth: ['', Validators.required],
      bloodType: ['', Validators.required],
      curp: ['', Validators.required],
      educationLevel: ['', Validators.required],
      localPhone: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required],
      nss: ['', Validators.required],
      rfc: ['', Validators.required],
      sex: ['', Validators.required],
    });
  }

  onSubmit() {
    this.form.patchValue({
      id: this.personId,
    });
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .put(`persondata/${this.personId}`, this.form.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (_) => {
          this.submitting = false;
          this.ref.close();
          this.customToastService.onClose();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadData() {
    this.dataService
      .get(`persondata/${this.personId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          resp.body;
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
