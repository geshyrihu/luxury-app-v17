import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-upload-img',
  templateUrl: './form-upload-img.component.html',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
})
export default class FormUploadImgComponent {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  uploadedFiles: HttpHeaders[] | any = [];
  maxFileSize: number = 30000000;
  url: string = `${environment.base_url}ServiceOrders/SubirImg/${this.config.data.serviceOrderId}`;

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.ref.close(true);
  }
}
