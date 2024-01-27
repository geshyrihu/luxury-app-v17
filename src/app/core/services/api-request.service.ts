import { Injectable, inject } from '@angular/core';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { CustomToastService } from './custom-toast.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
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
}
