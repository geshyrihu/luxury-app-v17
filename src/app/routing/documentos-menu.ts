import { AuthService } from 'src/app/core/services/auth.service';

export const libraryMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'Condomino',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
    ]),
    label: 'Biblioteca de documentos',
    icon: 'ffa-duotone fa-solid fa-books',
    name: 'Bliblioteca',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'Condomino',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
        ]),
        label: 'Documentos del edificio',
        routerLink: '/documento/documento',
        name: 'Documentos del edificio',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          // 'Condomino',
          // 'SupervisionOperativa',
          // 'Administrador',
          // 'Asistente',
        ]),
        label: 'Informe edos financieros',
        routerLink: '/documento/poliza',
        name: 'Informe edos financieros',
      },

      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Polizas de Mtto',
        routerLink: '/documento/poliza',
        name: 'Inventarios-Polizas de mantenimiento',
      },

      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Manuales y procesos',
        routerLink: '/documento/procesos',
        name: 'Capacitación-Manuales y procesos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Formatos',
        routerLink: '/documento/formatos',
        name: 'Capacitación-Formatos',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: 'Comunicados internos',
        routerLink: '/documento/comunicado',
        name: 'Capacitación-Comunicados internos',
      },

      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Catalogo luminación',
        routerLink: '/documento/iluminacion',
        name: 'Inventarios-Catalogo de iluminación',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Catalogo pintura',
        routerLink: '/documento/pintura',
        name: 'Inventarios-Catalogo de pintura',
      },
    ],
  },
];
