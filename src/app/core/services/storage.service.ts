import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: any;

  constructor() {
    // Inicializamos el servicio de almacenamiento (localStorage en este caso)
    this.storage = localStorage;
  }

  /**
   * Obtiene el valor asociado a una clave en el almacenamiento.
   * @param key Clave para la cual se desea obtener el valor.
   * @returns Valor asociado a la clave o undefined si no existe.
   */
  // retrieve(key: string): any {
  retrieve(key: string): any {
    const item = this.storage.getItem(key);

    if (item && item !== 'undefined') {
      // Si se encuentra el valor en el almacenamiento, se parsea de JSON y se devuelve.
      return JSON.parse(item);
    }
    return;
  }

  /**
   * Almacena una clave y su valor en el almacenamiento.
   * @param key Clave que se va a almacenar.
   * @param value Valor asociado a la clave.
   */
  store(key: string, value: any) {
    // Almacena la clave y el valor en el almacenamiento en formato JSON.
    this.storage.setItem(key, JSON.stringify(value));
  }

  /**
   * Elimina el valor asociado a una clave en el almacenamiento.
   * @param key Clave cuyo valor se va a eliminar.
   */
  remove(key: string) {
    // Remueve el valor asociado a la clave del almacenamiento.
    this.storage.removeItem(key);
  }
}
