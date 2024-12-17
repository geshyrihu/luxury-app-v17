import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
  selector: 'app-reclutamiento-solicitudes-router',
  templateUrl: './reclutamiento-solicitudes-router.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, RouterModule],
})
export default class ReclutamientoRouterComponent {}
