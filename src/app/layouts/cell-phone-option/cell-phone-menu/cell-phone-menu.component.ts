import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IMenuItem } from 'src/app/core/interfaces/menu.model';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import CustomerSelectionComponent from '../../topbar/customer-selection/customer-selection.component';
import CellPhoneSubMenuComponent from '../cell-phone-sub-menu/cell-phone-sub-menu.component';
@Component({
  selector: 'cell-phone-menu',
  templateUrl: './cell-phone-menu.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    RouterModule,
    CommonModule,
    CustomerSelectionComponent,
  ],
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

    // Cambia parte del valor del icono de light a solid
    // this.menu.forEach((item) => {
    //   if (item.icon) {
    //     item.icon = item.icon.replace('fa-thin', 'fa-solid'); // Cambia 'fa-light' por 'fa-solid'
    //   }
    // });
  }
  navigate(item: IMenuItem) {
    // Verifica si hay subelementos
    if (item.items && item.items.length > 0) {
      this.router.navigate(['menu/sub-menu/', item.label]);
    } else {
      this.router.navigate([item.routerLink]);
    }
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        CellPhoneSubMenuComponent,
        {
          label: data.label,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        console.log('🚀 ~ result:', result);
      });
  }
}
