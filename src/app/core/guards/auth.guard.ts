import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/common-services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  public authService = inject(AuthService);
  private route = inject(Router);

  /**
   * Método utilizado para verificar si el token de autenticación es válido antes de permitir la navegación a una ruta protegida.
   * @param next La instantánea de ruta activada.
   * @param state El estado actual de la ruta.
   * @returns Un observable que emite un valor booleano que indica si el token es válido o no.
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.validationToken().pipe(
      tap((JWTisValid) => {
        if (!JWTisValid) {
          // Redirigir al usuario a la página de inicio de sesión si el token no es válido.
          this.route.navigateByUrl('/auth/login');
        }
      })
    );
  }
}
