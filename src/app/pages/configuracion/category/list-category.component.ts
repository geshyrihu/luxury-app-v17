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
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);

  data: ICategory[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService.onGetList('Categories').then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`categories/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditCategoryComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
