import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-comites-list',
  templateUrl: './comites-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ComitesListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);

  // Declaración e inicialización de variables
  data: any;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Directories/Committees`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }
}
