import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IMenuItem } from '../../sidebar/menu.model';

@Component({
  selector: 'app-home-list-group',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-list-group.component.html',
})
export default class HomeListGroupComponent {
  @Input()
  data: IMenuItem[] = [];
  @Input()
  title: string = 'Titulo';
}
