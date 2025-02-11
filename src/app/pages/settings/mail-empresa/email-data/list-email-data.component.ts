import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditEmailDataComponent from './addoredit-email-data.component';

@Component({
  selector: 'app-list-email-data',
  templateUrl: './list-email-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEmailDataComponent {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS.onGetList('EmailData/List').then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestS.onDelete(`emaildata/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditEmailDataComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSendTestEmail(id: string) {
    this.apiRequestS.onGetList('SendEmail/SendTestMail/' + id);
  }
}
