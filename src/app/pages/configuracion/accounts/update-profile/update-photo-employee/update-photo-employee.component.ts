import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { InfoEmployeeAuthDto } from 'src/app/core/interfaces/user-token.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-photo-employee',
  templateUrl: './update-photo-employee.component.html',
  standalone: true,
  imports: [CommonModule, NgbModule, ToastModule],
  providers: [MessageService, CustomToastService],
})
export default class UpdatePhotoEmployeeComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public profielServiceService = inject(ProfielServiceService);

  base_urlImg = environment.base_urlImg + 'Administration/accounts/';
  employeeId?: number = 0;
  infoEmployeeDto: InfoEmployeeAuthDto;
  errorMessage: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.infoEmployeeDto = this.authService.userTokenDto.infoEmployeeDto;
    this.employeeId = this.authService.userTokenDto.infoEmployeeDto.employeeId;
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
    this.customToastService.onLoading();
    const formData = new FormData();
    formData.append('file', this.imgUpload);
    this.subRef$ = this.dataService
      .put('employees/updateImg/' + this.employeeId, formData)
      .subscribe({
        next: (resp: any) => {
          if (resp.body['pathFile'])
            this.infoEmployeeDto.photoPath = `${this.base_urlImg}${resp.body['pathFile']}`;
          this.profielServiceService.actualizarImagenPerfil(
            this.infoEmployeeDto.photoPath
          );
          // Mostrar un mensaje de éxito y cerrar Loading....
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
