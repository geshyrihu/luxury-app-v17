import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'inventario-productos',
    title: 'Inventario Insumos',
    data: { title: 'Inventario Insumos' }, // Cambiado a objeto
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-productos/list-almacen-productos.component'
      ),
  },
  {
    path: 'application-user',
    title: 'Cuentas de Usuario',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/list-application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Application User' },
  },
  {
    path: 'application-user',
    title: 'Cuentas de Usuario',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/list-application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Application User' },
  },
] as Routes;
