import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { menuPanel } from 'src/app/core/conts/menu-panel';
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PanelComponent {
  private route = inject(Router);

  menuPanel: any = menuPanel;

  onNavigate(route: string): void {
    this.route.navigateByUrl(route);
  }
}
