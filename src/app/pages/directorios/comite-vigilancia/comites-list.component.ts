import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-comites-list',
    templateUrl: './comites-list.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ComitesListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);

  // Declaración e inicialización de variables
  data: any;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `LegalDirectories/Committees`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = responseData;
    });
  }
}
