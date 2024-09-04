import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    //
    {
      group: 'Aplicacion',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/planet.svg',
          label: 'Planes',
          route: '/dashboard/services',
        },
        {
          icon: 'assets/icons/heroicons/outline/link.svg',
          label: 'Enlaces',
          route: '/dashboard/links',
        },
        {
          icon: 'assets/icons/heroicons/outline/documents.svg',
          label: 'Coberturas',
          route: '/dashboard/coverages',
        },
        {
          icon: 'assets/icons/heroicons/outline/ticket.svg',
          label: 'Descuentos',
          route: '/dashboard/discounts',
        }

      ],
    },


  ];
}
