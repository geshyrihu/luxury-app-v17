import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategory } from 'src/app/core/interfaces/category.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditCategoryComponent from './addoredit-category.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListCategoryComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  data: ICategory[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Categories`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    const urlApi = `categories/${id}`;
    this.apiRequestS.onDelete(urlApi).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditCategoryComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
