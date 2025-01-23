import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { IMenuItem } from 'src/app/layouts/sidebar/menu.model';
import { SidebarService } from '../../sidebar/sidebar.service';

@Component({
  selector: 'cell-phone-menu',
  templateUrl: './cell-phone-menu.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, RouterModule, CommonModule],
})
export default class CellPhoneMenuComponent implements OnInit {
  private sidebarService = inject(SidebarService);
  private router = inject(Router);
  dialogHandlerService = inject(DialogHandlerService);

  menu: IMenuItem[] = [];

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    // Carga el menú desde el servicio
    this.menu = this.sidebarService.onLoadMenu;
  }
  navigate(item: IMenuItem) {
    // Verifica si hay subelementos
    if (item.items && item.items.length > 0) {
      this.router.navigate(['menu/sub-menu/', item.label]);
    } else {
      this.router.navigate([item.routerLink]);
    }
  }
}
