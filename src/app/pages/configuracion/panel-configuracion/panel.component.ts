import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { menuPanel } from './menu-panel';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export default class PanelComponent {
  menuPanel = menuPanel;
}
