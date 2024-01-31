import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EMonth } from 'src/app/core/enums/month.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CurrencyMexicoPipe } from 'src/app/core/pipes/currencyMexico.pipe';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import AddoreditMaintenancePreventiveComponent from '../addoredit-maintenance-preventive.component';
const date = new Date();

@Component({
  selector: 'app-listado-anual-mantenimiento',
  templateUrl: './listado-anual-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CurrencyMexicoPipe],
})
export default class ListadoAnualMantenimientoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public apiRequestService = inject(ApiRequestService);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  month = date.getMonth();
  months: ISelectItemDto[] = onGetSelectItemFromEnum(EMonth);

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `MaintenanceCalendars/${this.customerIdService.getcustomerId()}/${
          this.month
        }`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  calculateCustomerTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.inventoryCategory === name) {
          total++;
        }
      }
    }

    return total;
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`maintenancecalendars/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        header: data.title,
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  selectMonth() {
    this.month = this.month;
    this.onLoadData();
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
