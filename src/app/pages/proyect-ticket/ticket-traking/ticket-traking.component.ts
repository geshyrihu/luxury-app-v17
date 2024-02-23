import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ApiRequestService,
  AuthService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-ticket-traking',
  templateUrl: './ticket-traking.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketTrakingComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  public apiRequestService = inject(ApiRequestService);

  seguimientos: any[] = [];
  submitting: boolean = false;

  loading = false;
  seguimientoLenght: number = 200;
  seguimientoConst: string = '';
  ticketId: string = this.config.data.ticketId;
  id: string = '';

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    ticketId: [this.ticketId, Validators.required],
    personId: [
      this.authService.userTokenDto.infoEmployeeDto.personId,
      Validators.required,
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ],
    ],
  });
  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  validarCaracteres(value: any) {
    this.seguimientoLenght = 200;
    this.seguimientoLenght = this.seguimientoLenght - value.value.length;

    if (this.seguimientoConst.length > 200) {
      const valor = this.seguimientoConst.substring(0, 199);
      this.form.patchValue({
        description: valor,
      });
    }
  }

  onCargaListaseguimientos() {
    // this.loading = true;
    // this.dataService
    //   .get<ITicketseguimiento[]>(`TicketLegal/Traking/${this.ticketId}`)
    //   .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
    //   .subscribe({
    //     next: (resp: any) => {
    //       this.seguimientos = resp.body;
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       this.customToastService.onCloseToError(error);
    //     },
    //   });
    this.apiRequestService
      .onGetItem(`TicketLegal/Traking/${this.ticketId}`)
      .then((result: any) => {
        this.seguimientos = result;
      });
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    // this.customToastService.onLoading();

    // this.dataService
    //   .post(`TicketLegal/Addtraking`, this.form.value)
    //   .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
    //   .subscribe({
    //     next: (_) => {
    //       this.onCargaListaseguimientos();
    //       this.form.patchValue({
    //         description: '',
    //       });
    //       this.seguimientoLenght = 200;
    //       this.customToastService.onCloseToSuccess();
    //     },
    //     error: (error) => {
    //       // Habilitar el botón nuevamente al finalizar el envío del formulario
    //       this.submitting = false;
    //       this.customToastService.onCloseToError(error);
    //     },
    //   });
    this.apiRequestService
      .onPostForModal(`TicketLegal/Addtraking`, this.form.value)
      .then(() => {
        this.onCargaListaseguimientos();
        this.form.patchValue({
          description: '',
        });
        this.seguimientoLenght = 200;
        this.submitting = false;
      });
  }
  // ngOnDestroy(): void {
  //   this.ref.close(true);

  //   this.dataService.ngOnDestroy();
  // }
}
