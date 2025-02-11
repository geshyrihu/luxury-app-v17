import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';

@Component({
  selector: 'app-filtro-minutas-area',
  templateUrl: './filtro-minutas-area.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [EnumSelectService],
})
export default class FiltroMinutasAreaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  enumSelectS = inject(EnumSelectService);

  data: any[] = [];
  meetingId: number;
  area: number;
  areaName: string = '';
  titleEstatus: string = '';
  estatus: number;
  customerName: string = '';

  async ngOnInit() {
    this.onLoadConfInitial();
    this.onLoadData();
  }

  onLoadConfInitial() {
    this.titleEstatus = this.config.data.titleEstatus;
    this.area = this.config.data.area;
    this.estatus = this.config.data.estatus;
    this.meetingId = this.config.data.meetingId;
    this.customerName = this.config.data.customerName;
    this.areaName = 'Revisiar nombre';
    // this.areaName = onGetNameEnumeration(
    //   onGetSelectItemFromEnum(EAreaMinutasDetalles),
    //   this.config.data.area
    // );
  }

  onLoadData() {
    const urlApi = `Dashboard/FiltroMinutasArea/${this.meetingId}/${this.area}/${this.estatus}`;

    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
