import { AuthService } from 'src/app/core/services/auth.service';

export const contabilidadMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
    label: 'Contabilidad',
    icon: 'fa-duotone fa-solid fa-hand-holding-dollar',
    items: [
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: 'Presentaciones JC',
        routerLink: '/junta-comite/presentaciones',
        name: 'Contabilidad-Presentaciones',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: 'Minutas JC',
        routerLink: '/contabilidad/pendientes-minutas',
        name: 'Contabilidad-Pendientes-Minutas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: 'Estados Financieros',
        routerLink: '/contabilidad/estados-financieros',
        name: 'Estados financieros',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: 'Presupuesto',
        routerLink: '/compras/cedula-cliente',
        name: 'Contabilidad-Presupuesto',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: 'Reporte Envio Financieros',
        routerLink: '/contabilidad/reporte-envio-financieros',
        name: 'Reporte-Envio-Financieros',
      },
    ],
  },
];
