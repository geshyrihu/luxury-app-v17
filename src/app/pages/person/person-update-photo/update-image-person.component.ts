import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';
const baseUrlImg = environment.base_urlImg;
@Component({
  selector: 'app-person-update-photo',
  templateUrl: './person-update-photo.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PersonUpdatePhotoComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  // is_role: boolean = false;
  submitting: boolean = false;

  private personId: number = 0;
  photoPath: string = '';
  // errorMessage: string = '';

  ngOnInit(): void {
    this.personId = this.config.data.personId;
    if (this.personId === 0 || !this.personId === undefined) {
      this.customToastService.onShowError();
    }
    this.onLoadData(this.personId);
  }

  onLoadData(personId: number) {
    this.dataService
      .get('person/photopath/' + personId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.photoPath = `${baseUrlImg}${resp.body.photoPath}`;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
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

    this.dataService
      .put('person/updateImg/' + this.personId, formData)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body.photoPath) {
            this.photoPath = `${baseUrlImg}Administration/accounts/${resp.body.photoPath}`;
            this.ref.close(true);
          } else {
            return false;
          }
          this.customToastService.onClose();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
