import { AuthService } from 'src/app/core/services/auth.service';

export const contabilidadMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
    label: '3.1 Contabilidad',
    icon: 'fa-duotone fa-solid fa-hand-holding-dollar',
    items: [
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: '3.1.1 Presentaciones JC',
        routerLink: '/operaciones/presentacion-junta-comite/presentaciones',
        name: 'Contabilidad-Presentaciones',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: '3.1.2 Minutas JC',
        routerLink: '/contabilidad/pendientes-minutas',
        name: 'Contabilidad-Pendientes-Minutas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: '3.1.3 Estados Financieros',
        routerLink: '/contabilidad/estados-financieros',
        name: 'Estados financieros',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: '3.1.4 Presupuesto',
        routerLink: '/operaciones/compras/cedula-cliente',
        name: 'Contabilidad-Presupuesto',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Contador']),
        label: 'Reporte Envio Financieros',
        routerLink: '/contabilidad/reporte-envio-financieros',
        name: '3.1.4 Reporte-Envio-Financieros',
      },
    ],
  },
];
