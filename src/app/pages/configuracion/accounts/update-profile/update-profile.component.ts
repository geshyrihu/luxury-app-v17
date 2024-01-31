import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import UpdatePasswordAccountComponent from './update-password/update-password.component';
import UpdatePhotoEmployeeComponent from './update-photo-person/update-photo-person.component';
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    RouterModule,
    UpdatePasswordAccountComponent,
    UpdatePhotoEmployeeComponent,
  ],
})
export default class UpdateProfilComponent {}
