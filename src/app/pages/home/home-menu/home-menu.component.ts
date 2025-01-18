import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-menu.component.html',
})
export default class HomeMenuComponent {
  @Input() data: IHomeMenu[] = [];
}
export interface IHomeMenu {
  icon: string;
  name: string;
  routerLink: string;
}
