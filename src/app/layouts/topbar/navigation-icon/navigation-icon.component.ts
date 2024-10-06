import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
@Component({
  selector: 'app-navigation-icon',
  templateUrl: './navigation-icon.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule],
})
export default class NavigationIconComponent {
  location = inject(Location);
  router = inject(Router);

  onBack() {
    this.location.back();
  }

  onNext() {
    this.location.forward();
  }

  onRefresh() {
    // window.location.href = window.location.href; // Reasignar la URL actual para recargar la página

    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
