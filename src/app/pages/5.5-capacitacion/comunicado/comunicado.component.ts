import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddOrEditComunicadoComponent from './addoredit-comunicado.component';
@Component({
  selector: 'app-comunicado',
  templateUrl: './comunicado.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ComunicadoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  filePath: string = environment.base_urlImg + 'Administration/comunicados/';
  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestService.onGetList('Comunicado').then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditComunicadoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Comunicado/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
