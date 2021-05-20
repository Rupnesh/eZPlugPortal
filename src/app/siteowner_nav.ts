import { INavData } from '@coreui/angular';

export const siteOwnerNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
    title: true,
    name: 'Management'
  },

  {
    name: 'Profile',
    url: '/profile',
    icon: 'icon-user',
  },
  
  {
    name: 'Site',
    url: '/management/site',
    icon: 'icon-grid',
  },
  {
    name: 'User',
    url: '/management/user',
    icon: 'icon-people',
  },
  {
    name: 'Reports',
    url: '/management/reports',
    icon: 'icon-book-open',
  },
  
];
