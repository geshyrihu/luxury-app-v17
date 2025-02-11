import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IFichaTecnicaActivo } from 'src/app/core/interfaces/ficha-tecnica-activo.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-ficha-tecnica-activo',
  templateUrl: './ficha-tecnica-activo.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FichaTecnicaActivoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: IFichaTecnicaActivo;
  id: number = 0;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Machineries/Fichatecnica/${this.id}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
