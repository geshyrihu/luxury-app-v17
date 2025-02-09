import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { IMenuItem, ISubMenuItem } from 'src/app/layouts/sidebar/menu.model';
@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule],
  templateUrl: './home-menu.component.html',
})
export default class HomeMenuComponent {
  @Input() menuItems: ISubMenuItem[] = [];

  selectedItem: IMenuItem | null = null;
  display: boolean = false; // Variable para controlar si el modal se muestra

  handleCardClick(item: IMenuItem): void {
    if (item.items && item.items.length > 0) {
      this.selectedItem = item;
      this.display = true; // Mostrar el modal con los subelementos
    } else if (item.routerLink) {
      // Navegación directa si no tiene subelementos.
    }
  }
}
