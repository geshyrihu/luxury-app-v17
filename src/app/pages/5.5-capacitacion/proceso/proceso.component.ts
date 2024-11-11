import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddOrEditProcesoComponent from './addoredit-proceso.component';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ProcesoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  filePath: string = environment.base_urlImg + 'Administration/procesos/';

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestService.onGetList('FormatoProceso').then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number): void {
    this.apiRequestService
      .onDelete(`formatoproceso/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditProcesoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
