import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { menuPanel } from './menu-panel';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export default class PanelComponent {
  private route = inject(Router);

  menuPanel: any = menuPanel;

  onNavigate(route: string): void {
    this.route.navigateByUrl(route);
  }
}
