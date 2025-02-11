import { Component, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-info-cuenta',
  templateUrl: './info-cuenta.component.html',
  standalone: true,
})
export default class InfoCuentaComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  apiRequestS = inject(ApiRequestService);

  id: number = 0;
  info: string = '';

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(`Cuentas/Info/${this.id}`)
      .then((result: any) => {
        this.info = result.information;
      });
  }
}
