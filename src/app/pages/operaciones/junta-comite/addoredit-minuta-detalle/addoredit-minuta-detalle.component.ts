import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-minuta-detalle',
  templateUrl: './addoredit-minuta-detalle.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditMinutaDetalleComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  public Editor = ClassicEditor;
  submitting: boolean = false;

  cb_estatus = [
    {
      value: 0,
      label: 'Pendiente',
    },
    {
      value: 1,
      label: 'Concluido',
    },
    {
      value: 2,
      label: 'No Autorizado',
    },
  ];
  cb_area: ISelectItemDto[] = onGetSelectItemFromEnum(EAreaMinutasDetalles);
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    responsibleAreaId: [1, Validators.required],
    status: [0, Validators.required],
    eAreaMinutasDetalles: [
      this.config.data.areaResponsable,
      Validators.required,
    ],
    title: ['', Validators.required],
    requestService: ['', Validators.required],
    meetingId: [this.config.data.meetingId, Validators.required],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`MeetingsDetails/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
        this.form.patchValue({
          employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
        });
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`MeetingsDetails`, this.form.value)
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
        .put(
          `MeetingsDetails/${this.id}/${this.authService.userTokenDto.infoEmployeeDto.employeeId}`,
          this.form.value
        )
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
