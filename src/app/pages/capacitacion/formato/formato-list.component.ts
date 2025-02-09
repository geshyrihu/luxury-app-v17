import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FormatoAddOrEditComponent from './formato-addoredit.component';

@Component({
  selector: 'app-formato-list',
  templateUrl: './formato-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormatoListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService.onGetList('formato').then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService.onDelete(`formato/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        FormatoAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
