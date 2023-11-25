import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Subscription } from 'rxjs'
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface'
import {
  AuthService,
  CustomToastService,
  DataService,
  DateService,
  FiltroCalendarService,
  SelectItemService,
} from 'src/app/core/services/common-services'
import ComponentsModule from 'src/app/shared/components.module'
import PrimeNgModule from 'src/app/shared/prime-ng.module'
import { environment } from 'src/environments/environment'
import AddOrEditBitacoraDiariaComponent from './addoredit-bitacora-diaria.component'
const base_url = environment.base_urlImg + 'Administration/accounts/'
@Component({
  selector: 'app-bitacora-diaria',
  templateUrl: './bitacora-diaria.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, FormsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class BitacoraDiariaComponent implements OnInit, OnDestroy {
  private dateService = inject(DateService)
  public authService = inject(AuthService)
  private dataService = inject(DataService)
  private dialogService = inject(DialogService)
  private selectItemService = inject(SelectItemService)
  private rangoCalendarioService = inject(FiltroCalendarService)
  private customToastService = inject(CustomToastService)

  loading: boolean = true
  base_url = base_url
  rangeDates: Date[] = []
  ref: DynamicDialogRef
  data: any[] = []
  subRef$: Subscription
  cb_user: any[] = []
  cb_customers: any[] = []
  cb_estatus: any[] = ['Concluido', 'Pendiente']

  //TODO: REVISAR SERVICIO FECHASSERVICE
  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull,
  )
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull,
  )
  employeeId = this.authService.infoEmployeeDto.employeeId
  depto: string = 'SUPERVISIÓN DE OPERACIONES'
  nombre: string =
    this.authService.infoEmployeeDto.firstName +
    ' ' +
    this.authService.infoEmployeeDto.lastName
  semana: string = this.fechaInicial + ' a ' + this.fechaFinal

  ngOnInit(): void {
    this.onLoadUserSupervisor()
    this.selectItemService.getCustomersNombreCorto().subscribe((resp) => {
      this.cb_customers = resp
    })
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio
      this.fechaFinal = resp.fechaFinal
      this.onLoadData()
    })
    this.onLoadData()
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()
    this.subRef$ = this.dataService
      .get(`AgendaSupervision/GetAll/${this.fechaInicial}/${this.fechaFinal}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body
          this.customToastService.onClose()
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError()
          console.log(err.error)
        },
      })
  }

  onLoadUserSupervisor() {
    this.subRef$ = this.dataService
      .get('SelectItem/getlistsupervision')
      .subscribe({
        next: (resp: any) => {
          this.cb_user = resp.body
        },
        error: (err) => {
          this.customToastService.onShowError()
          console.log(err.error)
        },
      })
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditBitacoraDiariaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      width: '40%',
      closeOnEscape: true,
      baseZIndex: 10000,
    })
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess()
        this.onLoadData()
      }
    })
  }

  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()
    this.subRef$ = this.dataService
      .delete('AgendaSupervision/' + data.id)
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe()
  }
}
