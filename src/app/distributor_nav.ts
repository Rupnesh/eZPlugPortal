import { INavData } from '@coreui/angular';

export const distributorNavItems: INavData[] = [
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
    name: 'Station',
    url: '/management/device',
    icon: 'icon-screen-desktop',
  },
  {
    name: 'User',
    url: '/management/user',
    icon: 'icon-people',
  },
  
  {
    name: 'Site',
    url: '/management/site',
    icon: 'icon-grid',
  },
  // {
  //   name: 'Payment',
  //   url: '/management/payment',
  //   icon: 'icon-credit-card',
  // },
  
  {
    name: 'Reports',
    url: '/management/reports',
    icon: 'icon-book-open',
  },
  
  // {
  //   name: 'Logout',
  //   url: '/dashboard',
  //   icon: 'icon-power',
  // },
  
];
