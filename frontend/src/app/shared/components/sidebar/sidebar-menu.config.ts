import { type ZardIcon } from '@/shared/components/icon';

export interface SubMenuItem {
  label: string;
  route?: string;
}

export interface MenuItem {
  icon: ZardIcon;
  label: string;
  route?: string;
  submenu?: SubMenuItem[];
}

export interface SidebarMenuConfig {
  workspace: MenuItem[];
  breadcrumbLabels: Record<string, string>;
  rootLabel: string;
  rootRoute: string;
}

export const ADMIN_MENU: SidebarMenuConfig = {
  workspace: [
    { icon: 'layout-dashboard', label: 'Tableau de bord', route: '/admin/dashboard' },
    { icon: 'inbox', label: 'Demandes d\'ajout', route: '/admin/shop-request' },
    { icon: 'store', label: 'Boutiques', route: '/admin/shop' },
    {
      icon: 'calendar',
      label: 'Planning',
      route: '/admin/planning'
    },
  ],
  rootLabel: 'Admin',
  rootRoute: '/admin/dashboard',
  breadcrumbLabels: {
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'planning': 'Planning',
    'add': 'Ajouter',
    'shop-request': 'Demandes',
    'shop': 'Shop',
  },
};

export const SHOP_MENU: SidebarMenuConfig = {
  workspace: [
        { icon: 'package', label: 'Liste des produits', route: '/shop/products' },
        { icon: 'package', label: 'Ajouter un produit', route: '/shop/products/add' },
  ],
  rootLabel: 'Shop',
  rootRoute: '/shop/products',
  breadcrumbLabels: {
    'shop': 'Shop',
    'products': 'Produits',
    'add': 'Ajouter',
    'edit': 'Modifier',
  },
};

export const DEFAULT_MENU: SidebarMenuConfig = {
  workspace: [],
  rootLabel: 'Accueil',
  rootRoute: '/',
  breadcrumbLabels: {},
};

