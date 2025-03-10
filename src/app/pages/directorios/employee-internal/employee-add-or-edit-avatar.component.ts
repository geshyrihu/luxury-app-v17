import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';

@Component({
    selector: 'employee-add-or-edit-avatar',
    templateUrl: './employee-add-or-edit-avatar.component.html',
    imports: [CommonModule]
})
export default class EmployeeAddOrEditAvatarComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);

  applicationUserId: string = '';
  photoPath: string = '';
  // Cambio de imagen
  public imgUpload: any;
  public imgTemp: any;
  imgName: any = '';

  ngOnInit() {
    this.applicationUserId = this.employeeAddOrEditService.onGetId();
    if (this.applicationUserId !== '') this.onLoadData();
  }

  onLoadData() {
    const urlApi = `EmployeeInternal/PhotoPath/${this.applicationUserId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.photoPath = responseData.photoPath;
    });
  }

  changeImg(file: File) {
    this.imgUpload = file;
    if (!file) {
      this.imgName = '';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.imgName = file;
    };

    this.uploadImg();
  }

  uploadImg() {
    // Mostrar un mensaje de carga
    const formData = new FormData();
    formData.append('file', this.imgUpload);

    this.apiRequestS
      .onPut('EmployeeInternal/UpdateImage/' + this.applicationUserId, formData)
      .then((responseData: any) => {
        if (responseData) this.photoPath = responseData.photoPath;
      });
  }
}
