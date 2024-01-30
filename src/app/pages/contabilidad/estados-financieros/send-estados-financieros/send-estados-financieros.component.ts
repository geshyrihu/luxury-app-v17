import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import PrimeNgModule from 'app/shared/prime-ng.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/IDestinatariosMailReporte.interface';
import {
  AuthService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-send-estados-financieros',
  templateUrl: './send-estados-financieros.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    FormsModule,
    PrimeNgModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class SendEstadosFinancierosComponent implements OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public authService = inject(AuthService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: number = 0;

  destinatarios: any[] = [];
  destinatariosFinal: IDestinatariosMailReporte[] = [];
  destinatariosAdicionales: IDestinatariosMailReporte[] = [];

  para: string = '';
  cc: string = '';
  cco: string = '';
  mostrarPara: boolean = false;
  mostrarCo: boolean = false;
  mostrarCco: boolean = false;
  placeholder: string = '';
  form: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        Validators.required,
      ],
    ],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    console.log('🚀 ~ this.config.data:', this.config.data);
    this.onLoadSelectItem();
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `ResidentesEdificio/${this.customerIdService.getcustomerId()}`
      )
      .subscribe((resp: any) => {
        this.destinatarios = resp;
        console.log('🚀 ~ this.destinatarios:', this.destinatarios);
      });
  }

  onEnviarEmail() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post(
        `EstadoFinanciero/Send/${this.id}/${this.authService.infoEmployeeDto.personId}`,
        this.onFilterDestinatarios()
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSelectAll() {
    this.destinatarios.forEach((resp) => {
      resp.select = true;
    });
  }
  onDeselecteAll() {
    this.destinatarios.forEach((resp) => {
      resp.select = false;
    });
  }

  onFilterDestinatarios(): IDestinatariosMailReporte[] {
    this.destinatariosFinal = [];
    this.destinatarios.forEach((resp) => {
      let correo: IDestinatariosMailReporte;
      if (resp.select !== undefined && resp.email !== null) {
        if (resp.select) {
          const correoFiltro = {
            nivelPrivacidad: resp.nivelPrivacidad,
            emailResidente: resp.email,
          };

          correo = resp.email;
          this.destinatariosFinal.push(correoFiltro);
        }
      }
    });

    this.destinatariosAdicionales.forEach((resp) => {
      this.destinatariosFinal.push(resp);
    });
    return this.destinatariosFinal;
  }

  onAddCorreo() {
    let nivelPrivacidad: string = '';
    if (this.mostrarPara) nivelPrivacidad = 'PARA';
    if (this.mostrarCo) nivelPrivacidad = 'CC';
    if (this.mostrarCco) nivelPrivacidad = 'CCO';
    const correoFiltro = {
      nivelPrivacidad: nivelPrivacidad,
      emailResidente: this.form.get('email').value,
    };
    this.form.patchValue({
      email: '',
    });
    this.destinatariosAdicionales.push(correoFiltro);
  }
  get f() {
    return this.form.controls;
  }

  onMostrarInput(
    para: boolean,
    cc: boolean,
    cco: boolean,
    placeholder: string
  ) {
    this.mostrarPara = para;
    this.mostrarCo = cc;
    this.mostrarCco = cco;
    this.placeholder = `${placeholder}  (separar correos con ";")`;
  }

  onDeleteDestinatariosAdicionales(indexArr: any) {
    this.destinatariosAdicionales.splice(indexArr, 1);
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
