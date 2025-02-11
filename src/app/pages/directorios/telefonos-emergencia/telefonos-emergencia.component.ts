import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditTelefonosEmergenciaComponent from './addoredit-telefonos-emergencia.component';

@Component({
    selector: 'app-telefonos-emergencia',
    templateUrl: './telefonos-emergencia.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class TelefonosEmergenciaComponent {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  authS = inject(AuthService);

  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TelefonosEmergencia`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`telefonosemergencia/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditTelefonosEmergenciaComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
