import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import {
  onGetNameEnumeration,
  onGetSelectItemFromEnum,
} from 'src/app/core/helpers/enumeration';
import { CustomPipeModule } from 'src/app/core/pipes/custom-pipe.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-filtro-minutas-area',
  templateUrl: './filtro-minutas-area.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomPipeModule],
})
export default class FiltroMinutasAreaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: any[] = [];
  meetingId: number;
  area: number;
  areaName: string = '';
  titleEstatus: string = '';
  estatus: number;
  customerName: string = '';

  ngOnInit(): void {
    this.onLoadConfInitial();
    this.onLoadData();
  }

  onLoadConfInitial() {
    this.titleEstatus = this.config.data.titleEstatus;
    this.area = this.config.data.area;
    this.estatus = this.config.data.estatus;
    this.meetingId = this.config.data.meetingId;
    this.customerName = this.config.data.customerName;
    this.areaName = onGetNameEnumeration(
      onGetSelectItemFromEnum(EAreaMinutasDetalles),
      this.config.data.area
    );
  }

  onLoadData() {
    const urlApi = `Dashboard/FiltroMinutasArea/${this.meetingId}/${this.area}/${this.estatus}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
