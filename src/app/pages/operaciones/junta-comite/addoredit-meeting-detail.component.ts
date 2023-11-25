import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EAreaMinutasDetallesPipe } from 'src/app/core/pipes/area-minuta-detalles.pipe';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'app-addoredit-meeting-detail',
  templateUrl: './addoredit-meeting-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    EAreaMinutasDetallesPipe,
    SanitizeHtmlPipe,
    EStatusPipe,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AddOrEditMeetingDetailComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(`MeetingsDetails/DetallesFiltro/${this.meetingId}/${this.status}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
