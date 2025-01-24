import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

import { TopbarModule } from './topbar.module';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [TopbarModule],
})
export class TopbarComponent {
  authS = inject(AuthService);

  @Output() settingsButtonClicked = new EventEmitter();

  customerName = this.authS.infoUserAuthDto.customer;
  customerPhotoPath = this.authS.infoUserAuthDto.customerPhotoPath;

  valueset: any;
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  @Output()
  mobileMenuButtonClicked = new EventEmitter();
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
}
