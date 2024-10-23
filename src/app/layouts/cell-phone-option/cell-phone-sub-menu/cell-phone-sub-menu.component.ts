import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMenuItem, ISubMenuItem } from 'src/app/core/interfaces/menu.model';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-cell-phone-sub-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell-phone-sub-menu.component.html',
})
export default class CellPhoneSubMenuComponent implements OnInit {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  routeActive = inject(ActivatedRoute);

  optionMenu: any;
  menu: IMenuItem[] = this.sidebarService.onLoadMenu;
  title = this.routeActive.snapshot.params.label;
  ngOnInit(): void {
    this.optionMenu = this.getSubItems(this.title);
  }
  getSubItems(label: string): IMenuItem[] {
    const menuItem = this.menu.find((item) => item.label === label);
    return menuItem ? menuItem.items || [] : [];
  }

  navigate(item: ISubMenuItem) {
    this.router.navigate([item.routerLink]);
  }
}
