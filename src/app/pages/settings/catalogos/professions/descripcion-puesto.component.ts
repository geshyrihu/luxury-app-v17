import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AutosizeDirective } from 'src/app/core/directives/autosize-text-area.diective';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-descripcion-puesto',
  templateUrl: './descripcion-puesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, AutosizeDirective],
})
export default class DescripcionPuestoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  profesion: any;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = 'Professions/' + this.config.data.id;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.profesion = responseData;
    });
  }
}
