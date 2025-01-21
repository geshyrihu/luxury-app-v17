import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'primeng/toast';
import { SimplebarAngularModule } from 'simplebar-angular';
import CurrentTitleComponent from './current-title/current-title.component';
import CustomerSelectionComponent from './customer-selection/customer-selection.component';
import NavigationIconComponent from './navigation-icon/navigation-icon.component';
import NotificationsComponent from './notifications/notifications.component';
import SearchComponent from './search/search.component';
import UserProfileComponent from './user-profile/user-profile.component';

@NgModule({
  imports: [
    CustomerSelectionComponent,
    NotificationsComponent,
    NavigationIconComponent,
    UserProfileComponent,
    SimplebarAngularModule,
    SearchComponent,
    ToastModule,
    CommonModule,
    NgbDropdownModule,
    CurrentTitleComponent,
  ],
  exports: [
    CustomerSelectionComponent,
    NotificationsComponent,
    NavigationIconComponent,
    UserProfileComponent,
    SimplebarAngularModule,
    SearchComponent,
    ToastModule,
    CommonModule,
    NgbDropdownModule,
    CurrentTitleComponent,
  ],
})
export class TopbarModule {}
