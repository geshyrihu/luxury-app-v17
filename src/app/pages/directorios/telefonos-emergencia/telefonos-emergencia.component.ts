import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditTelefonosEmergenciaComponent from './addoredit-telefonos-emergencia.component';

@Component({
  selector: 'app-telefonos-emergencia',
  templateUrl: './telefonos-emergencia.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TelefonosEmergenciaComponent {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  authS = inject(AuthService);

  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TelefonosEmergencia`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`telefonosemergencia/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditTelefonosEmergenciaComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
