import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-home-navbar.component.html',
})
export class DashboardHomeNavbarComponent {}
