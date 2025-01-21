import { Injectable, inject } from '@angular/core';
import { IMenuItem } from '../interfaces/menu.model';
import { AuthService } from './auth.service';

import * as MenuItems from 'src/app/layouts/sidebar/menuItems';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private authS = inject(AuthService);

  get onLoadMenu() {
    return this.menu;
  }
  menu: IMenuItem[] = [
    // ...MenuItems.catalogMenu(this.authS),
    // ...MenuItems.mailsEmpresaMenu(this.authS),
    // ...MenuItems.applicationUserMenu(this.authS),
    ...MenuItems.legalMenu(this.authS),
    ...MenuItems.contabilidadMenu(this.authS),
    ...MenuItems.sistemasMenu(this.authS),
    ...MenuItems.dashboardMenu(this.authS),
    ...MenuItems.miEdificioMenu(this.authS),
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
