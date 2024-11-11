import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IInventoriesPanelMenu } from 'src/app/core/interfaces/inventories-panel.menu.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuInventoriesPanel } from '../panel-inventories-menu';

@Component({
  selector: 'app-panel-inventories',
  templateUrl: './panel-inventories.component.html',
  imports: [RouterLink],
  standalone: true,
})
export default class PanelInventoriesComponent {
  authS = inject(AuthService);

  ticketPanelMenuItems: IInventoriesPanelMenu[] = MenuInventoriesPanel;
}
