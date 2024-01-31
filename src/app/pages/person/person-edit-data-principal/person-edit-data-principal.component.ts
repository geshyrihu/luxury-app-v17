import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-person-edit-data-principal',
  templateUrl: './person-edit-data-principal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class PersonEditDataPrincipalComponent implements OnInit {
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public selectItemService = inject(SelectItemService);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  public personId: number = 0;

  imagen: File;
  dataError = '';
  data: any;
  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      ],
    ],
  });

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .put('person/' + this.personId, this.form.value)
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

  ngOnInit(): void {
    this.personId = this.config.data.personId;
    if (this.personId !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.dataService
      .get(`person/${this.personId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
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
