import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EAreaMinutasDetallesPipe } from 'src/app/core/pipes/area-minuta-detalles.pipe';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
@Component({
  selector: 'app-addoredit-meeting-detail',
  templateUrl: './addoredit-meeting-detail.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, EAreaMinutasDetallesPipe, EStatusPipe],
})
export default class AddOrEditMeetingDetailComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  status: number = 0;
  meetingId: number = 0;
  data: any[] = [];

  ngOnInit() {
    this.meetingId = this.config.data.id;
    this.status = this.config.data.status;
    this.onLoadData();
  }
  orderData(value: any) {
    this.data.sort();
  }
  convertirFecha(item: any) {
    return this.dateService.getDateFormat(item);
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`MeetingsDetails/DetallesFiltro/${this.meetingId}/${this.status}`)
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

  calculateDetailTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.eAreaMinutasDetalles === name) {
          total++;
        }
      }
    }

    return total;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
