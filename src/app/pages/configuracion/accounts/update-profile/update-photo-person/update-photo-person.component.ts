import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { InfoEmployeeAuthDto } from 'src/app/core/interfaces/user-token.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-update-photo-person',
  templateUrl: './update-photo-person.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule, NgbModule, ToastModule],
})
export default class UpdatePhotoEmployeeComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public profielServiceService = inject(ProfielServiceService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  base_urlImg = environment.base_urlImg + 'Administration/accounts/';
  personId?: number = 0;
  infoEmployeeDto: InfoEmployeeAuthDto;
  errorMessage: string = '';

  ngOnInit(): void {
    this.infoEmployeeDto = this.authService.userTokenDto.infoEmployeeDto;
    this.personId = this.authService.userTokenDto.infoEmployeeDto.personId;
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
    this.dataService
      .put('person/updateImg/' + this.personId, formData)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            this.infoEmployeeDto.photoPath = `${this.base_urlImg}${resp.body.photoPath}`;
            this.profielServiceService.actualizarImagenPerfil(
              this.infoEmployeeDto.photoPath
            );
            // Mostrar un mensaje de éxito y cerrar Loading....
            this.customToastService.onCloseToSuccess();
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
