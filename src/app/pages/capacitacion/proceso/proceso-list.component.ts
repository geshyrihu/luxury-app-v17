import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ProcesoAddOrEditComponent from './proceso-addoredit.component';

@Component({
    selector: 'app-proceso-list',
    templateUrl: './proceso-list.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ProcesoListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS.onGetList('FormatoProceso').then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDelete(id: number): void {
    this.apiRequestS
      .onDelete(`formatoproceso/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProcesoAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
