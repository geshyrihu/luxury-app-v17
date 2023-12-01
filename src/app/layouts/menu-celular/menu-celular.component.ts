import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarService } from 'src/app/core/services/sidebar.service';
@Component({
  selector: 'app-menu-celular',
  templateUrl: './menu-celular.component.html',
  standalone: true,
  imports: [PanelModule, PanelMenuModule, RouterModule, CommonModule],
})
export default class MenuCelularComponent {
  private sidebarService = inject(SidebarService);

  menu: any = this.sidebarService.onLoadMenu;
}
