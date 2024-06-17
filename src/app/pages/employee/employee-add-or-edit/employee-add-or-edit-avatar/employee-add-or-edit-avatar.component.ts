import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { environment } from 'src/environments/environment';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';
const baseUrlImg = environment.base_urlImg;

@Component({
  selector: 'employee-add-or-edit-avatar',
  templateUrl: './employee-add-or-edit-avatar.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class EmployeeAddOrEditAvatarComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);

  base_urlImg = environment.base_urlImg + 'Administration/accounts/';

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
    const urlApi = `ApplicationUserEmployee/PhotoPath/${this.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.photoPath = result.photoPath;
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

    this.apiRequestService
      .onPut(
        'ApplicationUserEmployee/UpdateImg/' + this.applicationUserId,
        formData
      )
      .then((result: any) => {
        if (result) {
          this.photoPath = `${this.base_urlImg}${result.photoPath}`;
        }
      });
  }
}
