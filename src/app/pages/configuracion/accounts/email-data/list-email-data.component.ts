import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/common-services';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditEmailDataComponent from './addoredit-email-data.component';

@Component({
  selector: 'app-list-email-data',
  templateUrl: './list-email-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEmailDataComponent {
  public apiRequestService = inject(ApiRequestService);
  public dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList('EmailData/GetAsyncAll')
      .then((result: any) => {
        this.data = result;
      });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`emaildata/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditEmailDataComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSendTestEmail(applicationUserId: string) {
    this.apiRequestService.onGetList(
      'SendEmail/SendTestMail/' + applicationUserId
    );
  }
}
