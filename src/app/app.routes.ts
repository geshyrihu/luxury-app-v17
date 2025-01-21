import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';

export const routes: Routes = [
  {
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('src/app/routing/pages.routing'),
    path: '',
  },
  {
    canActivate: [AuthGuard],
    loadChildren: () => import('src/app/routing/compras.routing'),
    path: 'compras',
  },
  {
    path: 'utillidades',
    loadChildren: () => import('src/app/routing/utillidades.routing'),
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
];
