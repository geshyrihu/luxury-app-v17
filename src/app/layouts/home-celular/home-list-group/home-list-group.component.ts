import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-list-group',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-list-group.component.html',
})
export default class HomeListGroupComponent {
  @Input()
  data: IHomeListGroupComponent[] = [];
  @Input()
  title: string = 'HomeListGroupComponent';
}

export interface IHomeListGroupComponent {
  name: string;
  icon: string;
  routerLink: string;
  isAutorized: boolean;
}
