import { Injectable, OnDestroy, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { CustomToastService } from './custom-toast.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService implements OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);

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
      console.log('🚀 ~ urlApi:', urlApi, responseData.body);
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
      console.log('🚀 ~ urlApi:', urlApi, responseData.body);
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
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
      console.log('🚀 ~ responseData.body:', responseData.body);
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return null;
    }
  }

  // Metodo Post
  async onPostLogin<T>(urlApi: string, data: any): Promise<T | null> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    try {
      const responseData = await lastValueFrom(
        this.dataService.post<T>(urlApi, data).pipe(takeUntil(this.destroy$))
      );
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      this.customToastService.onCloseToSuccess();
      console.log('🚀 ~ responseData.body post:', responseData.body);
      return responseData.body;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return null;
    }
  }

  // Metodo Post
  async onPost<T>(urlApi: string, data: any): Promise<boolean> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    try {
      const responseData = await lastValueFrom(
        this.dataService.post<T>(urlApi, data).pipe(takeUntil(this.destroy$))
      );
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      this.customToastService.onCloseToSuccess();
      console.log('🚀 ~ responseData.body post:', responseData.body);
      return true;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return false;
    }
  }

  // Metodo Put
  async onPut<T>(urlApi: string, data: any): Promise<boolean> {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    try {
      const responseData = await lastValueFrom(
        this.dataService.put<T>(urlApi, data).pipe(takeUntil(this.destroy$))
      );
      // Cuando se completa la carga con éxito, mostrar un mensaje de éxito y resolver la promesa con los datos
      this.customToastService.onCloseToSuccess();
      console.log('🚀 ~ responseData.body put:', responseData.body);
      return true;
    } catch (error) {
      // En caso de error, mostrar un mensaje de error y rechazar la promesa con null
      this.customToastService.onCloseToError(error);
      return false;
    }
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
