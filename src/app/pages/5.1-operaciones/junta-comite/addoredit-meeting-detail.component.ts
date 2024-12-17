import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EAreaMinutasDetallesPipe } from 'src/app/core/pipes/area-minuta-detalles.pipe';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-addoredit-meeting-detail',
  templateUrl: './addoredit-meeting-detail.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, EAreaMinutasDetallesPipe, EStatusPipe],
})
export default class AddOrEditMeetingDetailComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  dateService = inject(DateService);

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
    const urlApi = `MeetingsDetails/DetallesFiltro/${this.meetingId}/${this.status}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  calculateDetailTotal(name: string) {
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
}
