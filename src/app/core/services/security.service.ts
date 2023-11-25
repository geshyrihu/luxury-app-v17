import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private storeService = inject(StorageService);

  private authSource = new Subject<boolean>();
  authChallenge$ = this.authSource.asObservable();

  /**
   * Obtiene el token de autenticación almacenado en el almacenamiento local.
   * @returns El token de autenticación o null si no está presente.
   */
  getToken(): any {
    return this.storeService.retrieve('token');
  }

  /**
   * Elimina los datos de autenticación del almacenamiento local.
   */
  resetAuthData() {
    this.storeService.remove('token');
  }

  /**
   * Almacena el token de autenticación en el almacenamiento local.
   * @param token El token de autenticación a almacenar.
   */
  setAuthData(token: string) {
    this.storeService.store('token', token);
  }

  /**
   * Cierra la sesión del usuario eliminando los datos de autenticación.
   */
  logOff() {
    this.resetAuthData();
  }
}
