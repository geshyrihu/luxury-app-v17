import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subir-pdf',
  templateUrl: './subir-pdf.component.html',
  standalone: true,
  imports: [FileUploadModule, SharedModule],
})
export default class SubirPdfComponent implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  uploadedFiles: HttpHeaders[] | any = [];
  maxFileSize: number = 20000000;
  url: string = '';
  pathUrl: string = '';
  ngOnInit(): void {
    this.pathUrl = this.config.data.pathUrl;
    this.url = `${environment.API_BASE_URL}${this.pathUrl}${this.config.data.serviceOrderId}`;
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.ref.close(true);
  }
}
