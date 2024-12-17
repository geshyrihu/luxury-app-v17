import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddOrEditFormatoComponent from './addoredit-formato.component';

@Component({
  selector: 'app-formato',
  templateUrl: './formato.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormatoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  filePath: string = environment.base_urlImg + 'Administration/formatos/';

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
        AddOrEditFormatoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDownloadFile(pathFileId: any, nameDocument: string) {
    const urlApi = `formato/download/${pathFileId}`;
    this.apiRequestService.onDownloadFile(urlApi, nameDocument);
  }

  // Function to extract file extension from pathFormato
  getFileExtension(pathFormato: string): string {
    const extension = pathFormato.split('.').pop()?.toLowerCase() || '';
    return extension;
  }

  // Function to get icon and color based on file extension
  getIconAndColor(extension: string): { icon: string; color: string } {
    switch (extension) {
      case 'pdf':
        return { icon: 'icon-file-pdf', color: 'red' };
      case 'doc':
      case 'docx':
        return { icon: 'icon-file-word', color: 'blue' };
      case 'xls':
      case 'xlsx':
        return { icon: 'icon-file-excel', color: 'green' };
      case 'ppt':
      case 'pptx':
        return { icon: 'icon-file-powerpoint', color: 'orange' };
      default:
        return { icon: 'icon-file', color: 'gray' };
    }
  }
}
