import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog'
import { Subscription } from 'rxjs'
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/IDestinatariosMailReporte.interface'
import { CustomerIdService } from 'src/app/core/services/common-services'
import { CustomToastService } from 'src/app/core/services/custom-toast.service'
import { DataService } from 'src/app/core/services/data.service'
import { SelectItemService } from 'src/app/core/services/select-item.service'
import ComponentsModule from 'src/app/shared/components.module'
import CustomButtonModule from 'src/app/shared/custom-buttons/custom-button.module'
import PrimeNgModule from 'src/app/shared/prime-ng.module'
@Component({
  selector: 'app-enviar-mail-reporte-semanal',
  templateUrl: './enviar-mail-reporte-semanal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    PrimeNgModule,
    CustomButtonModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class EnviarMailReporteSemanalComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService)
  private formBuilder = inject(FormBuilder)
  private selectItemService = inject(SelectItemService)
  public config = inject(DynamicDialogConfig)
  public customerIdService = inject(CustomerIdService)
  public dialogService = inject(DialogService)
  public messageService = inject(MessageService)
  public ref = inject(DynamicDialogRef)
  public customToastService = inject(CustomToastService)

  subRef$: Subscription
  fechaInicial: Date
  fechaFinal: Date
  destinatarios: any[] = []
  destinatariosFinal: IDestinatariosMailReporte[] = []
  destinatariosAdicionales: IDestinatariosMailReporte[] = []

  para: string = ''
  cc: string = ''
  cco: string = ''
  mostrarPara: boolean = false
  mostrarCo: boolean = false
  mostrarCco: boolean = false
  placeholder: string = ''
  form: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        Validators.required,
      ],
    ],
  })

  ngOnInit(): void {
    this.fechaInicial = this.config.data.fechaInicial
    this.fechaFinal = this.config.data.fechaFinal
    this.onLoadSelectItem()
  }

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem(
        `ResidentesEdificio/${this.customerIdService.getcustomerId()}`,
      )
      .subscribe((resp: any) => {
        this.destinatarios = resp
      })
  }

  onEnviarEmail() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()
    this.subRef$ = this.dataService
      .post(
        `SendEmail/ReporteSemanal/${this.customerIdService.getcustomerId()}/${
          this.fechaInicial
        }/${this.fechaFinal}`,
        this.onFilterDestinatarios(),
      )
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess()
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError()
          console.log(err.error)
        },
      })
  }
  onSelectAll() {
    this.destinatarios.forEach((resp) => {
      resp.select = true
    })
  }
  onDeselecteAll() {
    this.destinatarios.forEach((resp) => {
      resp.select = false
    })
  }

  onFilterDestinatarios(): IDestinatariosMailReporte[] {
    this.destinatariosFinal = []
    this.destinatarios.forEach((resp) => {
      let correo: IDestinatariosMailReporte
      if (resp.select !== undefined && resp.email !== null) {
        if (resp.select) {
          const correoFiltro = {
            nivelPrivacidad: resp.nivelPrivacidad,
            emailResidente: resp.email,
          }

          correo = resp.email
          this.destinatariosFinal.push(correoFiltro)
        }
      }
    })

    this.destinatariosAdicionales.forEach((resp) => {
      this.destinatariosFinal.push(resp)
    })
    return this.destinatariosFinal
  }

  onAddCorreo() {
    let nivelPrivacidad: string = ''
    if (this.mostrarPara) nivelPrivacidad = 'PARA'
    if (this.mostrarCo) nivelPrivacidad = 'CC'
    if (this.mostrarCco) nivelPrivacidad = 'CCO'
    const correoFiltro = {
      nivelPrivacidad: nivelPrivacidad,
      emailResidente: this.form.get('email').value,
    }
    this.form.patchValue({
      email: '',
    })
    this.destinatariosAdicionales.push(correoFiltro)
  }

  onMostrarInput(
    para: boolean,
    cc: boolean,
    cco: boolean,
    placeholder: string,
  ) {
    this.mostrarPara = para
    this.mostrarCo = cc
    this.mostrarCco = cco
    this.placeholder = `${placeholder}  (separar correos con ";")`
  }

  onDeleteDestinatariosAdicionales(indexArr: any) {
    this.destinatariosAdicionales.splice(indexArr, 1)
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe()
  }
}
