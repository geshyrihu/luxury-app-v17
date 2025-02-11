import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-form-upload-img',
    templateUrl: './form-upload-img.component.html',
    imports: [LuxuryAppComponentsModule, FileUploadModule]
})
export default class FormUploadImgComponent {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  uploadedFiles: HttpHeaders[] | any = [];
  maxFileSize: number = 30000000;
  url: string = `${environment.API_BASE_URL}ServiceOrders/SubirImg/${this.config.data.serviceOrderId}`;

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.ref.close(true);
  }
}
