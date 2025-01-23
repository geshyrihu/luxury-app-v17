import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from 'src/app/layouts/sidebar/menu.model';

import * as MenuItems from 'src/app/layouts/sidebar/index-menu-item';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule],
  templateUrl: './settings-home.component.html',
})
export default class SettingsHomeComponent {
  private authS = inject(AuthService);

  menuItemsGrouped: any;

  ngOnInit() {
    this.menuItemsGrouped = this.groupMenuItemsByGroup(
      MenuItems.settingMenu(this.authS)
    );
  }

  groupMenuItemsByGroup(items: IMenuItem[]) {
    return items.reduce((groups, item) => {
      const group = item.group || 'Otros'; // Si no tiene un group, se asigna 'Otros'
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  }
  objectKeys(obj: object) {
    return Object.keys(obj);
  }
}
