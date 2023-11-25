import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap'
import { MessageService } from 'primeng/api'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ToastModule } from 'primeng/toast'
import { Subscription } from 'rxjs'
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services'
import ComponentsModule from 'src/app/shared/components.module'
import AddOrEditCalendarioMaestroComponent from './addoredit-calendario-maestro.component'
import ModalDatosServicioComponent from './modal-datos-servicio/modal-datos-servicio.component'

@Component({
  selector: 'app-calendario-maestro',
  templateUrl: './calendario-maestro.component.html',
  standalone: true,
  imports: [
    NgbAlertModule,
    CommonModule,
    ComponentsModule,
    ToastModule,
    // EMonthPipe,
    NgbTooltipModule,
    NgbDropdownModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class CalendarioMaestroComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService)
  private dataService = inject(DataService)
  public dialogService = inject(DialogService)
  public messageService = inject(MessageService)
  public authService = inject(AuthService)
  data: any[] = []
  ref: DynamicDialogRef
  subRef$: Subscription

  ngOnInit(): void {
    this.onLoadData()
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()

    this.subRef$ = this.dataService.get('CalendarioMaestro/GetAll').subscribe({
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

  onDatosServicio(data: any) {
    this.ref = this.dialogService.open(ModalDatosServicioComponent, {
      data: {
        servicio: data.descripcionServicio,
        observaciones: data.observaciones,
        proveedores: data.proveedores,
      },
      header: 'Información de servicio',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    })
  }
  onDelete(data: any): any {
    this.subRef$ = this.dataService
      .delete(`CalendarioMaestro/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData()
          this.customToastService.onCloseToSuccess()
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError()
          console.log(err.error)
        },
      })
  }

  onModalAddOrEdit(id: number, mes: number) {
    this.ref = this.dialogService.open(AddOrEditCalendarioMaestroComponent, {
      data: {
        id,
        mes,
      },
      header: 'Calendario Maestro',
      height: '100%',
      width: '100%',
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe()
  }
}
