import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EInventoryCategory } from 'src/app/core/enums/inventory-category.enum';
import { EState } from 'src/app/core/enums/state.enum';
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
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-activos',
  templateUrl: './addoredit-activos.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    LuxuryAppComponentsModule,
    PrimeNgModule,
    CustomInputModule,
  ],
  providers: [DialogService, CustomToastService],
})
export default class AddOrEditActivosComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public getdateService = inject(DateService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  private customToastService = inject(CustomToastService);

  public Editor = ClassicEditor;

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  urlBaseImg = '';
  public id: number = 0;
  user = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  customerId: number = this.customerIdService.getcustomerId();
  machineryDTO: any;
  photoFileUpdate: boolean = false;
  category: any;
  cb_equipoClasificacion: ISelectItemDto[] = [];

  form: FormGroup;

  cb_inventoryCategory: ISelectItemDto[] =
    onGetSelectItemFromEnum(EInventoryCategory);
  optionActive: ISelectItemDto[] = onGetSelectItemFromEnum(EState);
  ngOnInit(): void {
    this.onLoadEquipoClasificacion();
    this.urlBaseImg = `${
      environment.base_urlImg
    }customers/${this.customerIdService.getcustomerId()}/machinery/`;
    this.category = this.config.data.inventoryCategory;

    if (this.config.data.id !== 0) this.onLoadData(this.config.data.id);

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      brand: [''],
      customerId: [this.customerId],
      dateOfPurchase: ['', [Validators.required]],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
      equipoClasificacionId: ['', Validators.required],
      inventoryCategory: [this.category, [Validators.required]],
      model: [''],
      nameMachinery: ['', [Validators.required, Validators.minLength(5)]],
      observations: [''],
      photoPath: [''],
      serie: [''],
      state: ['', [Validators.required]],
      technicalSpecifications: [''],
      ubication: ['', [Validators.required]],
    });
  }
  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
  onLoadData(id: number) {
    this.dataService
      .get(`Machineries/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.id = resp.body.id;
        resp.body.dateOfPurchase = this.getdateService.getDateFormat(
          resp.body.dateOfPurchase
        );
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    const model = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post('Machineries', model)
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
    } else {
      this.dataService
        .put(`Machineries/${this.id}`, model)
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
    }
  }

  private createFormData(machineryDTO: any): FormData {
    let formData = new FormData();
    formData.append('employeeId', machineryDTO.employeeId);
    formData.append('nameMachinery', machineryDTO.nameMachinery);
    formData.append('ubication', machineryDTO.ubication);
    formData.append('brand', machineryDTO.brand);
    formData.append('serie', machineryDTO.serie);
    formData.append('model', machineryDTO.model);
    formData.append('state', String(machineryDTO.state));
    formData.append(
      'dateOfPurchase',
      this.dateService.getDateFormat(machineryDTO.dateOfPurchase)
    );
    formData.append('customerId', String(this.customerId));
    formData.append(
      'equipoClasificacionId',
      String(machineryDTO.equipoClasificacionId)
    );
    formData.append(
      'inventoryCategory',
      String(machineryDTO.inventoryCategory)
    );
    formData.append(
      'technicalSpecifications',
      machineryDTO.technicalSpecifications
    );
    formData.append('observations', machineryDTO.observations);
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (machineryDTO.photoPath) {
      formData.append('photoPath', machineryDTO.photoPath);
    }
    return formData;
  }

  onLoadEquipoClasificacion() {
    this.dataService
      .get('EquipoClasificacion/SelectItem')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_equipoClasificacion = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  get f() {
    return this.form.controls;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
