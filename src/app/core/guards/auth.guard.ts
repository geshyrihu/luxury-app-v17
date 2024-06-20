// Importa decoradores y funciones necesarias desde @angular/core y @angular/router
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
// Importa Observable y operadores desde rxjs
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// Importa el servicio de autenticación
import { AuthService } from '../services/auth.service';

// Decorador @Injectable indica que este servicio se puede inyectar en otras clases
@Injectable({
  providedIn: 'root', // Proporciona este servicio en el nivel raíz de la aplicación
})
export class AuthGuard implements CanActivate {
  // Constructor para inyectar dependencias: AuthService y Router
  constructor(private authService: AuthService, private router: Router) {}

  // Implementación del método canActivate que define si una ruta puede ser activada
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Llama al método validateToken del AuthService y maneja la respuesta
    return this.authService.validateToken().pipe(
      // El operador tap permite ejecutar efectos secundarios sin alterar los datos
      tap((isValid: boolean) => {
        if (!isValid) {
          // Si el token no es válido, redirige al usuario a la página de login
          this.router.navigateByUrl('/auth/login');
        }
      }),
      // catchError maneja errores que pueden ocurrir en el observable
      catchError((error) => {
        // Imprime el error en la consola
        console.error('Error durante la validación del token:', error);
        // Redirige al usuario a la página de login
        this.router.navigateByUrl('/auth/login');
        // Devuelve false para indicar que la ruta no puede ser activada
        return of(false);
      })
    );
  }
}
