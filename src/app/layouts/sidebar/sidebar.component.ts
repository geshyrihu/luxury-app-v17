import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import MetisMenu from 'metismenujs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { MenuItem } from '../../core/interfaces/menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [SimplebarAngularModule, FormsModule, RouterModule, CommonModule],
})

/**
 * Sidebar Component
 */
export default class SidebarComponent implements OnInit {
  private sidebarService = inject(SidebarService);
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  menu: any;
  menuItems: MenuItem[] = [];
  ngOnInit(): void {
    // Cargar elementos del menú desde el servicio de la barra lateral
    this.menuItems = this.sidebarService.onLoadMenu;
  }

  initialize(): void {
    // this.menuItems = this.sidebarService.menu;
  }

  /**
   * Activa el menú desplegable
   */
  ngAfterViewInit() {
    this.menu = new MetisMenu('#side-menu');
    this._activateMenuDropdown();
  }

  /**
   * Comprueba si un elemento del menú tiene subelementos
   * @param item Elemento del menú
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Elimina las clases 'mm-active' y 'mm-show'
   * @param className Nombre de la clase a eliminar
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activa el menú desplegable principal
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    }
  }
}
