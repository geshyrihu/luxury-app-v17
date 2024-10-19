import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IMenuItem,
  ISubMenuItem,
  ISubMenuItems,
} from 'src/app/core/interfaces/menu.model';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sub-menu-sub-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-menu-sub-menu.component.html',
})
export default class SubMenuSubMenuComponent {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  optionMenu: any;

  menu: IMenuItem[] = this.sidebarService.onLoadMenu;
  subMenuItems: ISubMenuItem[] = []; // Array para almacenar los submenús

  title = this.activatedRoute.snapshot.params.label;
  ngOnInit(): void {
    this.subMenuItems = this.getSubMenuItemsWithChildren(this.title);
    console.log('SubMenuItems:', this.subMenuItems);
  }

  getSubMenuItemsWithChildren(label: string): ISubMenuItems[] {
    // Filtrar submenús que tengan items definidos y no vacíos
    const filterData = this.menu.flatMap((menuItem) =>
      (menuItem.items || []).filter(
        (subItem) => subItem.items && subItem.items.length > 0
      )
    );
    // Encuentra el primer nivel del menú por etiqueta
    const menuItem = filterData.find((item) => item.label === label);

    return menuItem && menuItem.items ? menuItem.items : [];
  }
  navigate(item: ISubMenuItem) {
    // this.ref.close(true);
    this.router.navigate([item.routerLink]);
  }
}
