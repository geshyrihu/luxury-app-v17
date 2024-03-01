import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  FileUploadControl,
  FileUploadModule,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/IDestinatariosMailReporte.interface';
import {
  ApiRequestService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import AgregarCorreoElectronicoComponent from 'src/app/shared/agregar-correo-electronico/agregar-correo-electronico.component';
import ListadoCondominosComponent from 'src/app/shared/listado-condominos/listado-condominos.component';

@Component({
  selector: 'app-enviar-comunicado',
  templateUrl: './enviar-comunicado.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ReactiveFormsModule, FileUploadModule],
})
export default class EnviarComunicadoComponent {
  public apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  public animation: boolean = false;

  submitting: boolean = false;

  ref: DynamicDialogRef;
  cb_asuntos: any[] = [
    { value: 'COMUNIADO', label: 'COMUNIADO' },
    {
      value: 'ESTADOS FINANCIEROS CORRESPONDIENTES A ',
      label: 'ESTADOS FINANCIEROS CORRESPONDIENTES A ',
    },
  ];
  public Editor = ClassicEditor;
  private filesControl = new FormControl(
    null,
    FileUploadValidators.filesLimit(2)
  );
  public demoForm = new FormGroup({
    files: this.filesControl,
  });
  public fileUploadControl = new FileUploadControl(
    null,
    FileUploadValidators.filesLimit(2)
  );

  para: IDestinatariosMailReporte[] = [];
  copia: IDestinatariosMailReporte[] = [];
  copiaOculta: IDestinatariosMailReporte[] = [];
  subject: string = '';
  body: string = '';
  nivel: number;

  onModalCorreosCondominos() {
    this.ref = this.dialogService.open(ListadoCondominosComponent, {
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: any) => {
      this.copiaOculta = resp;
    });
  }
  onModalAgregarCorreoElectronico(nivel: number) {
    this.nivel = nivel;
    this.ref = this.dialogService.open(AgregarCorreoElectronicoComponent, {
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: any) => {
      const correoFiltro = {
        nivelPrivacidad: 'PARA',
        emailResidente: String(resp),
      };

      if (nivel == 0) {
        correoFiltro.nivelPrivacidad = 'PARA';
        this.para.push(correoFiltro);
      }
      if (nivel == 1) {
        correoFiltro.nivelPrivacidad = 'CC';
        this.copia.push(correoFiltro);
      }
      if (nivel == 2) {
        correoFiltro.nivelPrivacidad = 'CCO';
        this.copiaOculta.push(correoFiltro);
      }
    });
  }

  onDeletePara(indexArr: any) {
    this.para.splice(indexArr, 1);
  }
  onDeleteCopia(indexArr: any) {
    this.copia.splice(indexArr, 1);
  }
  onDeleteCopiaOculta(indexArr: any) {
    this.copiaOculta.splice(indexArr, 1);
  }
  onSubmit() {
    let model = this.onCreateFormData();
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post('SendEmail/SendComunicado', model)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onCreateFormData() {
    let formData = new FormData();
    formData.append('subject', this.subject);
    formData.append('body', this.body);
    formData.append('customerId', String(this.customerIdService.customerId));

    if (this.demoForm.value.files != null) {
      for (var i = 0; i < this.demoForm.value.files.length; i++) {
        formData.append('attachments', this.demoForm.value.files[i]);
      }
    }
    if (this.para != null) {
      for (var i = 0; i < this.para.length; i++) {
        formData.append('para', this.para[i].emailResidente);
      }
    }
    if (this.copia != null) {
      for (var i = 0; i < this.copia.length; i++) {
        formData.append('copia', this.copia[i].emailResidente);
      }
    }
    if (this.copiaOculta != null) {
      for (var i = 0; i < this.copiaOculta.length; i++) {
        formData.append('copiaOculta', this.copiaOculta[i].emailResidente);
      }
    }
    return formData;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
