import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InfoAccountAuthDto } from 'src/app/core/interfaces/user-token.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfielServiceService } from 'src/app/core/services/profiel-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export default class UserProfileComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  profielServiceService = inject(ProfielServiceService);
  router = inject(Router);

  infoAccountAuthDto: InfoAccountAuthDto;

  profileImageUrl: string = '';

  ngOnInit() {
    this.infoAccountAuthDto = this.authService.infoUserAuthDto;
    this.profileImageUrl =
      environment.base_urlImg +
      'Administration/Accounts/' +
      this.infoAccountAuthDto.photoPath;
    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.infoAccountAuthDto = nuevaImagenUrl.imagenUrl;
      }
    );
  }

  /**
   * Logout the user
   */
  logout() {
    const currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
    this.router.navigate(['/auth/login']);

    this.apiRequestService
      .onGetItem(
        `Auth/Logout/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .then(() => {});
  }
}
