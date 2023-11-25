import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
const baseUrlImg = environment.base_urlImg;
@Component({
  selector: 'app-addoredit-employee-img',
  templateUrl: './addoredit-employee-img.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditEmployeeOnlyImgComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public customToastService = inject(CustomToastService);

  is_role: boolean = false;
  submitting: boolean = false;

  private id: string = '';
  photoPath: string = '';
  errorMessage: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.id = this.config.data.applicationUserId;
    this.onLoadData(this.id);
  }

  onLoadData(id: string) {
    this.subRef$ = this.dataService
      .get('Employees/GetDataUser/' + id)
      .subscribe({
        next: (resp: any) => {
          this.photoPath = `${baseUrlImg}Administration/accounts/${resp.body.photoPath}`;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

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
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.imgName = file;
    };
  }
  uploadImg() {
    const formData = new FormData();
    formData.append('file', this.imgUpload);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put('Employees/updateImg/' + this.id, formData)
      .subscribe({
        next: (resp: any) => {
          if (resp.body['pathFile']) {
            this.photoPath = `${baseUrlImg}Administration/accounts/${resp.body['pathFile']}`;
            this.ref.close(true);
          } else {
            return false;
          }
          this.customToastService.onClose();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
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
