import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { MessageService } from 'primeng/api'
import { Observable, Subscription } from 'rxjs'
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface'
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe'
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-general-anual-mantenimiento',
  templateUrl: './general-anual-mantenimiento.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbAlertModule, SanitizeHtmlPipe],
  providers: [CustomToastService, MessageService],
})
export default class GeneralAnualMantenimientoComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService)
  public customerIdService = inject(CustomerIdService)
  public customToastService = inject(CustomToastService)

  data: any[] = []
  subRef$: Subscription
  customerId$: Observable<number> = this.customerIdService.getCustomerId$()
  cb_providers: ISelectItemDto[] = []
  providerId = ''
  pathImg = ''

  ngOnInit() {
    this.onLoadData()
    this.onLoadProveedores()
    this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`
    this.customerId$.subscribe((resp) => {
      this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`
      this.onLoadData()
    })
  }
  onLoadProveedores() {
    this.cb_providers = []
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdService.customerId}`,
      )
      .subscribe({
        next: (resp: any) => {
          this.cb_providers = resp.body
        },
        error: (err) => {
          this.customToastService.onShowError()
          console.log(err.error)
        },
      })
  }
  onLoadData() {
    this.data = []
    // Mostrar un mensaje de carga
    this.customToastService.onLoading()
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdService.customerId}/${this.providerId}`,
      )
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
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe()
  }
}
