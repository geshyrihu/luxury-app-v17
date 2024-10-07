import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { IModelToken } from '../interfaces/model-token.interface';
import {
  EPermission,
  IUserToken,
  InfoAccountAuthDto,
} from '../interfaces/user-token.interface';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storageService = inject(StorageService);
  dataService = inject(DataService);
  router = inject(Router);

  userTokenDto: IUserToken;
  infoUserAuthDto: InfoAccountAuthDto;

  employeeId: number = 0;
  applicationUserId: string = '';
  statusJWT: boolean = false;
  data: IModelToken = { token: '' };
  validateRole: boolean = false;

  /**
   * Valida la existencia y autenticidad del token JWT almacenado en el sistema de almacenamiento.
   * Si el token no es válido o no existe, redirige a la página de inicio de sesión.
   * @returns Un observable que indica si el token es válido.
   */
  validateToken() {
    // Obtener el token almacenado en el sistema de almacenamiento
    this.data.token = this.storageService.retrieve('token');

    // Si el token es indefinido, redirigir al inicio de sesión
    if (this.data.token === undefined) {
      this.router.navigateByUrl('/auth/login');
    }

    // Enviar una solicitud al servidor para validar el token
    return this.dataService.post('Auth/ValidateJwtToken', this.data).pipe(
      map((resp: any) => {
        // Almacenar la información del token y el estado del JWT
        this.userTokenDto = resp.body;
        this.infoUserAuthDto = this.userTokenDto.infoUserAuthDto;
        this.userTokenDto.permission = resp.body.permission;
        console.log('🚀 ~ permissions:', resp.body.permission);
        this.applicationUserId = this.infoUserAuthDto.applicationUserId;
        if (resp.body.token) {
          this.statusJWT = true;
        }
        return this.statusJWT;
      }),
      catchError((_) => of(false))
    );
  }

  /**
   * Valida si el usuario tiene uno de los roles especificados.
   * @param roles Roles a validar.
   * @returns True si el usuario tiene uno de los roles especificados, de lo contrario, false.
   */
  onValidateRoles(roles: string[]): boolean {
    return this.userTokenDto.roles.some((item) => roles.includes(item));
  }

  permmission(moduleName: string, permission: EPermission): boolean {
    if (this.userTokenDto && this.userTokenDto.permission) {
      // Verificar el contenido de userTokenDto
      console.log('🚀 ~ userTokenDto:', this.userTokenDto);

      const modulePermission = this.userTokenDto.permission.find(
        (p) => p.moduleName === moduleName
      );

      if (modulePermission) {
        const permissionKey = permission as keyof typeof modulePermission; // No necesitas convertir si el enum es de tipo string
        console.log('🚀 ~ permissionKey:', permissionKey);
        return Boolean(modulePermission[permissionKey]); // Asegúrate de que modulePermission[permissionKey] sea booleano
      }
    }

    return false;
  }

  redirectUrl: string | null = null; // URL a la que se redirigirá después de logear

  // isLoggedIn(): boolean {
  //   // Lógica para verificar si el usuario está autenticado
  //   return !!localStorage.getItem('token'); // ejemplo simple, se puede mejorar
  // }
}
