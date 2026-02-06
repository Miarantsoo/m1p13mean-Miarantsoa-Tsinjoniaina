import { Component, signal } from '@angular/core';

import {type ZardIcon, ZardIconComponent} from '@/shared/components/icon';
import { LayoutImports } from "../layout";
import {ZardButtonComponent} from '@/shared/components/button';
import { ZardBreadcrumbImports } from "../breadcrumb/breadcrumb.imports";
import { ZardMenuImports } from "../menu";
import {ZardSkeletonComponent} from '@/shared/components/skeleton';
import {ZardTooltipImports} from '@/shared/components/tooltip';
import {ZardDividerComponent} from '@/shared/components/divider';
import {ZardAvatarComponent} from '@/shared/components/avatar';

interface MenuItem {
  icon: ZardIcon;
  label: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'z-demo-layout-collapsible',
  imports: [
    LayoutImports,
    ZardButtonComponent,
    ZardBreadcrumbImports,
    ZardMenuImports,
    ZardSkeletonComponent,
    ZardTooltipImports,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardIconComponent,
  ],
  standalone: true,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  readonly sidebarCollapsed = signal(false);

  mainMenuItems: MenuItem[] = [
    { icon: 'house', label: 'Home' },
    { icon: 'inbox', label: 'Inbox' },
  ];

  workspaceMenuItems: MenuItem[] = [
    {
      icon: 'folder',
      label: 'Projects',
      submenu: [{ label: 'Design System' }, { label: 'Mobile App' }, { label: 'Website' }],
    },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'search', label: 'Search' },
  ];

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}
