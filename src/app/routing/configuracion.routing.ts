import { Routes } from '@angular/router';
export default [
  {
    path: 'roles',
    loadComponent: () =>
      import('src/app/pages/configuracion/roles/list-roles.component'),
  },

  {
    path: 'categorias',
    loadComponent: () =>
      import('src/app/pages/configuracion/category/list-category.component'),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('src/app/pages/configuracion/customer/list-customer.component'),
  },
  {
    path: 'unidad-medida',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/unidad-medida/list-unidad-medida.component'
      ),
  },
  {
    path: 'depuracion',
    loadComponent: () =>
      import('src/app/pages/configuracion/depuracion/depuracion.component'),
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('src/app/pages/configuracion/panel-configuracion/panel.component'),
  },
  {
    path: 'historial-acceso',
    loadComponent: () =>
      import('src/app/pages/configuracion/historial-acceso/access-log.component'),
  },
  {
    path: 'categoria-medidor',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/medidores-categoria/list-medidor-categoria.component'
      ),
  },
  {
    path: 'clasificacion-equipo',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/clasificacion-equipo/list-clasificacion-equipo.component'
      ),
  },
] as Routes;
