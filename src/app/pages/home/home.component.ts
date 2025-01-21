import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { IMenuItem } from 'src/app/core/interfaces/menu.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ModulePermissionService } from 'src/app/core/services/module-permission.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { IHomeListGroupComponent } from './home-list-group/home-list-group.component';
import { HomeMenuService } from './home-menu.service';
import HomeMenuComponent from './home-menu/home-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HomeMenuComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent implements OnInit {
  private sidebarService = inject(SidebarService);
  private customerIdService = inject(CustomerIdService);
  modulePermissionService = inject(ModulePermissionService);

  authS = inject(AuthService);
  homeMenuService = inject(HomeMenuService);

  customerId: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  menu: any;
  menuItems: IMenuItem[] = [];

  data: IHomeListGroupComponent[] = this.homeMenuService.onLoadMenu;

  ngOnInit(): void {
    // Cargar elementos del menú desde el servicio de la barra lateral
    this.menuItems = this.sidebarService.onLoadMenu;
  }
}
