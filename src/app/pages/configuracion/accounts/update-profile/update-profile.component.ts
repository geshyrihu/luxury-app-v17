import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import UpdatePasswordAccountComponent from './update-password/update-password.component';
import UpdatePhotoEmployeeComponent from './update-photo-employee/update-photo-employee.component';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UpdatePasswordAccountComponent,
    UpdatePhotoEmployeeComponent,
  ],
})
export default class UpdateProfilComponent {}
