import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private authS = inject(AuthService);
  private route = inject(Router);

  /**
   * Método utilizado para verificar si el token de autenticación es válido antes de permitir la navegación a una ruta protegida.
   * @param next La instantánea de ruta activada.
   * @param state El estado actual de la ruta.
   * @returns Un observable que emite un valor booleano que indica si el token es válido o no.
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authS.validateToken().pipe(
      tap((JWTisValid) => {
        if (!JWTisValid) {
          // Guardar la URL a la que el usuario intentaba acceder
          this.authS.redirectUrl = state.url;
          // Redirigir al usuario a la página de inicio de sesión si el token no es válido.
          this.route.navigateByUrl('/auth/login');
        }
      })
    );
  }
}
