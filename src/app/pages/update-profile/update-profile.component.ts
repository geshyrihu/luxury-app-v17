import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import UpdatePasswordAccountComponent from './update-password.component';
import UpdatePhotoApplicationUserComponent from './update-photo-application-user.component';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    UpdatePasswordAccountComponent,
    UpdatePhotoApplicationUserComponent,
  ],
})
export default class UpdateProfilComponent {}
