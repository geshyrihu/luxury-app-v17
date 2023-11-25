import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-minuta-detalle',
  templateUrl: './addoredit-minuta-detalle.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
    CKEditorModule,
  ],
  providers: [CustomToastService],
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
  private enumService = inject(EnumService);

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
  cb_area: ISelectItemDto[] = [];
  cb_responsibleArea: any[] = [
    { value: 1, label: 'Administración' },
    { value: 12, label: 'Mantenimiento' },
    { value: 15, label: 'Contabilidad' },
    { value: 16, label: 'Juridico' },
    { value: 11, label: 'Constructora' },
    { value: 13, label: 'Sistemas' },
  ];

  id: number = 0;
  subRef$: Subscription;
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
    this.enumService
      .onGetSelectItemEmun('EAreaMinutasDetalles')
      .subscribe((resp) => {
        this.cb_area = resp;
      });

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`MeetingsDetails/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
        this.form.patchValue({
          employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
        });
      });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`MeetingsDetails`, this.form.value)
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
    } else {
      this.subRef$ = this.dataService
        .put(
          `MeetingsDetails/${this.id}/${this.authService.userTokenDto.infoEmployeeDto.employeeId}`,
          this.form.value
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
    }
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
