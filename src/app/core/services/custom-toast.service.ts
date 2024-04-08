import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CustomToastService {
  messageService = inject(MessageService);

  /**
   * Muestra un mensaje de éxito.
   */
  onShowSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito!',
      detail: 'Operación completada',
    });
  }

  /**
   * Muestra un mensaje de información.
   * @param detail Detalles del mensaje de información.
   */
  onShowInfo(detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: detail,
    });
  }

  /**
   * Muestra un mensaje de advertencia.
   * @param detail Detalles del mensaje de advertencia.
   */
  onShowWarn(detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: detail,
    });
  }

  /**
   * Muestra un mensaje de error.
   */
  onShowError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo completar la tarea',
    });
  }

  /**
   * Muestra una ventana emergente de carga.
   */
  onLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
  }

  /**
   * Cierra la ventana emergente actual.
   */

  onCloseOnGetData(data: any) {
    Swal.close();
    return data;
  }
  onClose() {
    Swal.close();
  }
  onCloseToSuccess() {
    this.onShowSuccess();
    Swal.close();
  }
  onCloseToError(err: any = null): void {
    this.onShowError();
    Swal.close();
    // En caso de error, mostrar un mensaje de error y registrar el error en la consola
    console.log('Error:', err.error);
  }

  /**
   * Muestra una ventana emergente de error con un mensaje personalizado.
   * @param mensaje Mensaje de error a mostrar.
   */
  onLoadingError(mensaje: string) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      title: 'Error',
      text: mensaje,
    });
  }
}
