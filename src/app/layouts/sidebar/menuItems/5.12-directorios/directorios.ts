import { AuthService } from 'src/app/core/services/auth.service';

export const directoryMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.12 DIRECTORIOS'),
    label: '5.12 Directorios',
    icon: 'fa-duotone fa-solid fa-address-book',
    items: [
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '5.12.1 Clientes (Condominios)',
        routerLink: '/settings/clientes',
        name: 'Directorio-Clientes',
      },
      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.2 Organigrama interno',
        routerLink: '/directory/organigrama-interno',
        name: 'Directorio-Organigrama interno',
      },
      {
        visible: authS.canRead('5.12.3 DIRECTORIOCOMITEVIGILANCIA'),
        label: '5.12.3 Comité de vigilancia',
        routerLink: '/directory/comite-vigilancia',
        name: 'Directorio-Comité de vigilancia',
      },
      {
        visible: authS.canRead('5.12.4 DIRECTORIOEMPLEADOINTERNO'),
        label: '5.12.4 Personal interno',
        routerLink: '/directory/personal-interno',
        name: 'Directorio-Empleados internos',
      },
      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.5 Personal externo',
        routerLink: '/directory/personal-externo',
        name: 'Directorio-Empleados externos',
      },
      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.6 Catalogo de proveedores',
        routerLink: '/directory/proveedor',
        name: 'Directorio-Proveedores',
      },
      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.7 Mis Proveedores',
        routerLink: '/directory/mis-proveedores',
        name: 'Operaciones-Mis proveedores',
      },
      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.8 Supervisores externos',
        routerLink: '/settings/supplier-supervisors',
        name: 'supplier-supervisors',
      },
      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.9 Propiedades',
        routerLink: '/directory/propiedades',
        name: 'Directorio-Propiedades',
      },
      {
        visible: authS.canRead('5.12.10 DIRECTORIOCONDOMINOS'),
        label: '5.12.10 Condominos',
        routerLink: '/directory/condominos',
        name: 'Directorio-Condominos',
      },

      {
        visible: authS.canRead('5.12 DIRECTORIOS'),
        label: '5.12.11 Télefonos emergencia',
        routerLink: '/directory/telefonos-emergencia',
      },
    ],
  },
];
