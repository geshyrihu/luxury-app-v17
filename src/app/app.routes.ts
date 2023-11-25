import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('src/app/routing/pages.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/routing/auth.routing'),
  },
  {
    path: 'publico',
    loadChildren: () => import('src/app/routing/publico.routing'),
  },
  {
    path: 'compras',
    loadChildren: () => import('src/app/routing/compras.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'utillidades',
    loadChildren: () => import('src/app/routing/utillidades.routing'),
    canActivate: [AuthGuard],
  },
];
