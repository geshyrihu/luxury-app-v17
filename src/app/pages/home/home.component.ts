import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { IHomeListGroupComponent } from './home-list-group/home-list-group.component';
import { HomeMenuService } from './home-menu.service';
import HomeMenuComponent from './home-menu/home-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HomeMenuComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  authS = inject(AuthService);
  homeMenuService = inject(HomeMenuService);
  data: IHomeListGroupComponent[] = this.homeMenuService.onLoadMenu;
}
