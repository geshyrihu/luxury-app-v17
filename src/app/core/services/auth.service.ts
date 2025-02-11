import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { IModelToken } from '../interfaces/model-token.interface';
import {
  SelectItemCustomerAccessDto as CustomerAccessDto,
  IUserToken,
  InfoAccountAuthDto,
} from '../interfaces/user-token.interface';
import { DataConnectorService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storageS = inject(StorageService);
  dataConnectorS = inject(DataConnectorService);
  router = inject(Router);

  userTokenDto: IUserToken;
  infoUserAuthDto: InfoAccountAuthDto;
  customerAccess: CustomerAccessDto[] = [];

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
    this.data.token = this.storageS.retrieve('token');

    // Si el token es indefinido, redirigir al inicio de sesión
    if (this.data.token === undefined) {
      this.router.navigateByUrl('/auth/login');
    }

    // Enviar una solicitud al servidor para validar el token
    return this.dataConnectorS.post('Auth/ValidateJwtToken', this.data).pipe(
      map((resp: any) => {
        // Almacenar la información del token y el estado del JWT
        this.userTokenDto = resp.body;
        this.infoUserAuthDto = this.userTokenDto.infoUserAuthDto;
        this.customerAccess = resp.body.customerAccess;
        this.userTokenDto.permission = resp.body.permission;
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
    // Validar que userTokenDto y sus roles existan
    if (!this.userTokenDto || !this.userTokenDto.roles) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }

    // Validar si el usuario tiene alguno de los roles especificados
    const hasPermission = this.userTokenDto.roles.some((item) =>
      roles.includes(item)
    );
    return hasPermission;
  }

  redirectUrl: string | null = null; // URL a la que se redirigirá después de logear
}
