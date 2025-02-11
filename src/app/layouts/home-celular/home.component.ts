import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ModulePermissionService } from 'src/app/core/services/module-permission.service';
import { IMenuItem } from 'src/app/layouts/sidebar/menu.model';
import { ApiRequestService } from './../../core/services/api-request.service';
import { HomeMenuService } from './home-menu.service';
import HomeMenuComponent from './home-menu/home-menu.component';

@Component({
    selector: 'app-home',
    imports: [LuxuryAppComponentsModule, RouterModule, HomeMenuComponent],
    templateUrl: './home.component.html'
})
export default class HomeComponent implements OnInit {
  private apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  modulePermissionService = inject(ModulePermissionService);

  homeMenuService = inject(HomeMenuService);

  customerId: number;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  // menu: any;
  menuItems: IMenuItem[] = [];

  ngOnInit(): void {
    // this.onLoadMenu();
    // this.customerId$.subscribe((_) => {
    //   this.onLoadMenu();
    // });
    // Cargar elementos del menú desde el servicio de la barra lateral
    this.menuItems = this.homeMenuService.onLoadMenu;
  }

  onLoadMenu() {
    const applicationUserId =
      this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
    const customerId = this.customerIdS.getCustomerId();
    const urlApi = `MenuItems/Mobil/${customerId}/${applicationUserId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.menuItems = responseData;
    });
  }
}
