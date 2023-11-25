import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfielServiceService {
  // Creamos un Subject para la actualización de la imagen de perfil
  private imagenPerfilActualizada = new Subject<{}>();

  // Creamos un Observable a partir del Subject para permitir la suscripción desde otros componentes
  imagenPerfilActualizada$ = this.imagenPerfilActualizada.asObservable();

  /**
   * Actualiza la imagen de perfil y notifica a los observadores.
   * @param imagenUrl URL de la nueva imagen de perfil.
   */
  actualizarImagenPerfil(imagenUrl: string) {
    // Emitimos un evento a través del Subject para notificar a los observadores con la nueva URL de la imagen.
    this.imagenPerfilActualizada.next({ imagenUrl: imagenUrl });
  }
}
