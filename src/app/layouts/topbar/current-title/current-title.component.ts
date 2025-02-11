import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-current-title',
    imports: [],
    templateUrl: './current-title.component.html'
})
export default class CurrentTitleComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  constructor() {
    this.getCurrentRouteTitle();
  }

  currentTitle: string | undefined;

  /**
   * Obtiene el título de la ruta actual desde los datos asociados.
   */
  private getCurrentRouteTitle() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd), // Filtra solo los eventos de navegación completados
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild; // Navega hasta la ruta más específica
          }
          return route.snapshot.data['title']; // Obtiene el título de los datos
        })
      )
      .subscribe((title: string | undefined) => {
        this.currentTitle = title;
      });
  }
}
