import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MessageService } from 'primeng/api'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ToastModule } from 'primeng/toast'
import { Observable, Subscription } from 'rxjs'
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/addoredit-maintenance-preventive.component'
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services'

@Component({
  selector: 'app-gastos-mantenimiento',
  templateUrl: './gastos-mantenimiento.component.html',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService, DialogService, CustomToastService],
})
export default class GastosMantenimientoComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService)
  public dataService = inject(DataService)
  public customerIdService = inject(CustomerIdService)
  public messageService = inject(MessageService)
  public dialogService = inject(DialogService)

  data: any[] = []
  resumenGastos: any[] = []
  customerId$: Observable<number> = this.customerIdService.getCustomerId$()
  totalGasto: number = 0
  ref: DynamicDialogRef
  subRef$: Subscription

  ngOnInit(): void {
    this.onLoadData()
    this.customerId$.subscribe(() => {
      this.onLoadData()
    })
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/SummaryOfExpenses/${this.customerIdService.getcustomerId()}`,
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body.items
          this.totalGasto = resp.body.totalGastos
          this.customToastService.onClose()
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError()
          console.log(err.error)
        },
      })
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/Resumengastos/${this.customerIdService.getcustomerId()}`,
      )
      .subscribe({
        next: (resp: any) => {
          this.resumenGastos = resp.body
          this.customToastService.onClose()
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError()
          console.log(err.error)
        },
      })
  }
  onModalItem(item: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: item.id,
          task: 'edit',
          idMachinery: item.idEquipo,
        },
        header: 'Editar regitro',
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      },
    )
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess()
        this.onLoadData()
      }
    })
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe()
  }
}
