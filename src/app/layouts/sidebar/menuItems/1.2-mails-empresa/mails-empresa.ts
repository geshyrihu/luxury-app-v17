import { AuthService } from 'src/app/core/services/auth.service';

export const mailsEmpresaMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['SuperUsuario']),
    label: '1.2 Mails empresa',
    icon: 'fa-duotone fa-solid fa-envelope',
    name: 'Mails empresa',
    items: [
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.2.1 Emails corporativos',
        routerLink: '/settings/customer-data-company',
        name: 'customer-data-company',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.2.2 Datos de email',
        routerLink: '/settings/datos-email',
        name: 'datos de correos',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.2.3 Depuración',
        routerLink: '/settings/depuration',
        name: 'depuration',
      },
    ],
  },
];
