import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private securityService = inject(SecurityService);

  /**
   * Intercepta las solicitudes HTTP y agrega el token JWT de autenticación a las cabeceras si está disponible.
   * @param req La solicitud HTTP original.
   * @param next El siguiente manejador de la cadena de interceptores.
   * @returns Un observable que emite un evento HTTP con los resultados de la solicitud.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.securityService.getToken();

    // Verifica si hay un token de autenticación disponible.
    if (token) {
      // Clona la solicitud original y agrega el token a las cabeceras.
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Continúa la cadena de interceptores y envía la solicitud con las cabeceras actualizadas.
    return next.handle(req);
  }
}
