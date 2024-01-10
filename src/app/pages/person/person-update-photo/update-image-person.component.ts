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
  selector: 'app-person-update-photo',
  templateUrl: './person-update-photo.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule],
  providers: [MessageService, CustomToastService],
})
export default class PersonUpdatePhotoComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);

  // is_role: boolean = false;
  submitting: boolean = false;

  private personId: number = 0;
  photoPath: string = '';
  // errorMessage: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.personId = this.config.data.personId;
    if (this.personId === 0 || !this.personId === undefined) {
      this.customToastService.onShowError();
    }
    this.onLoadData(this.personId);
  }

  onLoadData(personId: number) {
    this.subRef$ = this.dataService
      .get('person/photopath/' + personId)
      .subscribe({
        next: (resp: any) => {
          this.photoPath = `${baseUrlImg}${resp.body.photoPath}`;
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

  // La función recibe un parámetro 'file' que es de tipo File (un archivo).
  onChangePhotoPath(file: File) {
    // Se asigna el archivo a una variable llamada 'imgUpload'.
    this.imgUpload = file;

    // Si el archivo es falsy (es decir, es null, undefined, etc.),
    // se limpia el nombre de la imagen y se sale de la función.
    if (!file) {
      this.imgName = '';
      return;
    }

    // Si el archivo no es falsy, se crea un objeto 'FileReader'.
    const reader = new FileReader();

    // Se lee el contenido del archivo como una URL base64.
    reader.readAsDataURL(file);

    // Cuando la operación de lectura del archivo finaliza,
    // se ejecuta este bloque de código.
    reader.onloadend = () => {
      // Se asigna el resultado de la lectura (la URL base64) a 'imgTemp'.
      this.imgTemp = reader.result;

      // Se asigna el archivo a 'imgName'. Esto probablemente se hizo
      // para mostrar el nombre de la imagen en algún lugar de la interfaz.
      this.imgName = file;
    };
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.imgUpload);

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put('person/updateImg/' + this.personId, formData)
      .subscribe({
        next: (resp: any) => {
          if (resp.body.photoPath) {
            this.photoPath = `${baseUrlImg}Administration/accounts/${resp.body.photoPath}`;
            this.ref.close(true);
            console.log('🚀 ~ this.photoPath:', this.photoPath);
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
