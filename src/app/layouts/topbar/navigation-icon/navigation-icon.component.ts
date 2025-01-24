import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navigation-icon',
  templateUrl: './navigation-icon.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule],
})
export default class NavigationIconComponent {
  authS = inject(AuthService);
  location = inject(Location);
  router = inject(Router);

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }

  onRefresh() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  onHome() {
    this.router.navigateByUrl('/dashboard');
  }
  onSetting() {
    this.router.navigateByUrl('/settings/home');
  }
}
