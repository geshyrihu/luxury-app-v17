import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUseCFDI } from 'src/app/core/interfaces/use-cfdi.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditUsoCFDIComponent from './addoredit-uso-cfdi.component';

@Component({
  selector: 'app-uso-cfdi',
  templateUrl: './list-uso-cfdi.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListUsoCfdiComponent implements OnInit {
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);

  data: IUseCFDI[] = [];

  ref: DynamicDialogRef;
  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS.onGetList('UsoCfdi').then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestS.onDelete(`UsoCfdi/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditUsoCFDIComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
