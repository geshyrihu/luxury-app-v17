import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ApiRequestService,
  AuthService,
} from 'src/app/core/services/common-services';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { IUseCFDIDto } from '../../../core/interfaces/IUseCfdi.interface';
import AddoreditUsoCFDIComponent from './addoredit-uso-cfdi.component';

@Component({
  selector: 'app-uso-cfdi',
  templateUrl: './list-uso-cfdi.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListUsoCfdiComponent implements OnInit {
  public authService = inject(AuthService);
  public dialogHandlerService = inject(DialogHandlerService);
  public apiRequestService = inject(ApiRequestService);

  data: IUseCFDIDto[] = [];

  ref: DynamicDialogRef;
  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestService.onGetList('UsoCfdi').then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService.onDelete(`UsoCfdi/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditUsoCFDIComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
