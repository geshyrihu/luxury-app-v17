import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnDestroyService implements OnDestroy {
  // Utilizado para la gestión de recursos al destruir el componente
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
