import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import MetisMenu from 'metismenujs';
import { Observable } from 'rxjs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { IMenuItem } from './menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  // styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    SimplebarAngularModule,
    FormsModule,
    RouterModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * Sidebar Component
 */
export default class SidebarComponent implements OnInit, AfterViewInit {
  authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  private apiRequestS = inject(ApiRequestService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('sideMenu') sideMenu!: ElementRef;
  menu: any;
  menuItems: IMenuItem[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    // this.menuItems = this.sidebarService.onLoadMenu;
    this.onLoadItems();
    this.customerId$.subscribe((_) => {
      this.onLoadItems();
    });
  }

  onLoadItems() {
    const applicationUserId =
      this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
    const customerId = this.customerIdS.getCustomerId();
    const urlApi = `MenuItems/${customerId}/${applicationUserId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.menuItems = responseData;

      this.cdr.detectChanges(); // Forzar actualización de la vista

      this.onLoadMenuFunction();
    });
  }

  onLoadMenuFunction() {
    setTimeout(() => {
      if (this.menu) {
        this.menu.dispose(); // Destruir instancia previa
      }
      this.menu = new MetisMenu('#side-menu'); // Inicializar MetisMenu
      this._activateMenuDropdown(); // Activar el menú desplegable
    }, 1000);
  }

  /**
   * Activa el menú desplegable
   */
  ngAfterViewInit() {
    this.onLoadMenuFunction();
    // setTimeout(() => {
    //   this.menu = new MetisMenu('#side-menu');
    //   this._activateMenuDropdown();
    // }, 500);
  }
  /**
   * Comprueba si un elemento del menú tiene subelementos
   * @param item Elemento del menú
   */
  hasItems(item: IMenuItem) {
    return item.items !== undefined ? item.items.length > 0 : false;
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
