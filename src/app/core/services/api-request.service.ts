import { Injectable, OnDestroy, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import saveAs from 'file-saver';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { CustomToastService } from './custom-toast.service';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root',
})
export class ApiRequestService implements OnDestroy {
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  // Función para eliminar...
  async onDelete(urlApi: string): Promise<boolean> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    try {
      await lastValueFrom(
        this.dataService.delete(urlApi).pipe(
          takeUntil(this.destroy$) // Cancelar la suscripción cuando el componente se destruye
        )
      );
      // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y resolver la promesa con true
      this.customToastService.onCloseToSuccess();
      return true;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con false
      this.customToastService.onCloseToError(error);
      return false;
    }
  }

  // Función para cargar datos de forma genérica
  async onGetSelectItem<T>(urlApi: string): Promise<T | null> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    try {
      const responseData = await lastValueFrom(
        this.dataService
          .get<T>('selectitem/' + urlApi)
          .pipe(takeUntil(this.destroy$))
      );
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      this.customToastService.onClose();
      console.log(`resp: ${urlApi}`, responseData.body);
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return null;
    }
  }
  // Función para cargar datos de forma genérica
  async onGetList<T>(urlApi: string): Promise<T | null> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    try {
      const responseData = await lastValueFrom(
        this.dataService.get<T>(urlApi).pipe(takeUntil(this.destroy$))
      );
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      this.customToastService.onClose();
      console.log(`resp: ${urlApi}`, responseData.body);
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return null;
    }
  }

  async onGetListNotLoading<T>(urlApi: string): Promise<T | null> {
    try {
      const responseData = await lastValueFrom(
        this.dataService.get<T>(urlApi).pipe(takeUntil(this.destroy$))
      );
      console.log(`resp: ${urlApi}`, responseData.body);
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onShowError();
      return null;
    }
  }

  // Obtener un item x Id
  async onGetItem<T>(urlApi: string): Promise<T | null> {
    // Mostrar un mensaje de carga
    try {
      const responseData = await lastValueFrom(
        this.dataService.get<T>(urlApi).pipe(takeUntil(this.destroy$))
      );
      console.log(`resp: ${urlApi}`, responseData.body);
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return null;
    }
  }

  // onPost

  async onPost<T>(urlApi: string, data: any): Promise<boolean | T> {
    this.customToastService.onLoading();
    try {
      const responseData = await lastValueFrom(
        this.dataService.post<T>(urlApi, data).pipe(takeUntil(this.destroy$))
      );
      this.customToastService.onCloseToSuccess();
      console.log(`resp: ${urlApi}`, responseData.body);
      return responseData.body; // Devuelve los datos recibidos
    } catch (error) {
      console.log('🚀 ~ error:', error);
      this.customToastService.onCloseToError(error);
      return false;
    }
  }

  // Metodo Put
  async onPut<T>(urlApi: string, data: any): Promise<boolean | T> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    try {
      const responseData = await lastValueFrom(
        this.dataService.put<T>(urlApi, data).pipe(takeUntil(this.destroy$))
      );
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      this.customToastService.onCloseToSuccess();
      console.log(`resp: ${urlApi}`, responseData.body);
      return responseData.body; // Devuelve los datos recibidos;
      // return true;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return false;
    }
  }
  exportToExcel(urlApi: string, nameDocument: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Llamar a getFile para obtener el archivo Excel
    this.dataService
      .getFile(urlApi)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: Blob) => {
          // Crea un objeto de tipo Blob a partir de la respuesta
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Utiliza la función saveAs del paquete 'file-saver' para descargar el archivo
          saveAs(blob, nameDocument);

          // Cuando se completa la exportación con éxito, mostrar un mensaje de éxito
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          // En caso de error, mostrar un mensaje de error
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // validacion de formulario...
  validateForm(form: FormGroup): boolean {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return false;
    }
    return true;
  }

  // Cuando se destruye el componente, desvincular y liberar recursos
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
