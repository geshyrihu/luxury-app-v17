import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ToastModule } from 'primeng/toast';
import { InfoAccountAuthDto } from 'src/app/core/interfaces/user-token.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-update-photo-application-user',
  templateUrl: './update-photo-application-user.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule, NgbModule, ToastModule],
})
export default class UpdatePhotoApplicationUserComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  public profielServiceService = inject(ProfielServiceService);

  base_urlImg = environment.base_urlImg + 'Administration/accounts/';
  applicationUserId: string = this.authS.applicationUserId;
  infoEmployeeDto: InfoAccountAuthDto;

  ngOnInit(): void {
    this.infoEmployeeDto = this.authS.infoUserAuthDto;
  }

  // Cambio de imagen
  public imgUpload: any;
  public imgTemp: any;
  imgName: any = '';

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
        'ApplicationUserEmployee/UpdateImage/' + this.applicationUserId,
        formData
      )
      .then((result: any) => {
        if (result) {
          this.infoEmployeeDto.photoPath = `${this.base_urlImg}${result.photoPath}`;
          this.profielServiceService.actualizarImagenPerfil(
            this.infoEmployeeDto.photoPath
          );
        }
      });
  }
}
