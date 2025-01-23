import { Injectable, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from 'src/app/layouts/sidebar/menu.model';

import * as MenuItems from 'src/app/layouts/sidebar/index-menu-item';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private authS = inject(AuthService);

  get onLoadMenu() {
    return this.menu;
  }
  menu: IMenuItem[] = [
    ...MenuItems.legalMenu(this.authS),
    ...MenuItems.contabilidadMenu(this.authS),
    // ...MenuItems.sistemasMenu(this.authS),
    ...MenuItems.dashboardMenu(this.authS),
    // ...MenuItems.miEdificioMenu(this.authS),
    ...MenuItems.ticketsMenu(this.authS),
    ...MenuItems.juntasDeComiteMenu(this.authS),
    ...MenuItems.comprasMenu(this.authS),
    ...MenuItems.mttoPreventivoMenu(this.authS),
    ...MenuItems.mttoBitacorasMenu(this.authS),
    ...MenuItems.almacenMenu(this.authS),
    ...MenuItems.inventariosMenu(this.authS),
    ...MenuItems.libraryMenu(this.authS),
    ...MenuItems.calendarMenu(this.authS),
    ...MenuItems.directoryMenu(this.authS),
    ...MenuItems.supervisionMenu(this.authS),
    ...MenuItems.entregaRecepcionMenu(this.authS),
    ...MenuItems.reportMenu(this.authS),
    ...MenuItems.reclutamientoMenu(this.authS),
    ...MenuItems.utilidadesMenu(this.authS),
  ];
}
