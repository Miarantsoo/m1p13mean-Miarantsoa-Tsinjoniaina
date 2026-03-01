import {Component, computed, inject, signal} from '@angular/core';

import { ZardIconComponent } from '@/shared/components/icon';
import { LayoutImports } from "../layout";
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardBreadcrumbImports } from "../breadcrumb/breadcrumb.imports";
import { ZardMenuImports } from "../menu";
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardAvatarComponent } from '@/shared/components/avatar';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@/core/services/http/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  ADMIN_MENU,
  DEFAULT_MENU,
  MenuItem,
  SHOP_MENU,
  SidebarMenuConfig
} from './sidebar-menu.config';

@Component({
  selector: 'z-demo-layout-collapsible',
  imports: [
    LayoutImports,
    ZardButtonComponent,
    ZardBreadcrumbImports,
    ZardMenuImports,
    ZardTooltipImports,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardIconComponent,
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  readonly sidebarCollapsed = signal(false);
  protected authService: AuthService;
  private router = inject(Router);

  readonly currentUser = toSignal(inject(AuthService).currentUser$, { initialValue: null });

  private readonly currentUrl = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: this.router.url }
  );

  readonly menuConfig = computed<SidebarMenuConfig>(() => {
    const url = this.currentUrl();
    if (url.startsWith('/admin')) return ADMIN_MENU;
    if (url.startsWith('/shop'))  return SHOP_MENU;
    return DEFAULT_MENU;
  });

  readonly workspaceMenuItems = computed<MenuItem[]>(() => this.menuConfig().workspace);

  readonly breadcrumbs = computed(() => {
    const config = this.menuConfig();
    const url = this.currentUrl() ?? '/';
    const segments = url.split('/').filter(s => s.length > 0);

    const items: { label: string; route: string }[] = [
      { label: config.rootLabel, route: config.rootRoute },
    ];

    let path = '';
    for (let i = 1; i < segments.length; i++) {
      path += '/' + segments.slice(0, i + 1).join('/');
      const label = config.breadcrumbLabels[segments[i]] ?? segments[i];
      items.push({ label, route: '/' + segments.slice(0, i + 1).join('/') });
    }

    return items;
  });

  constructor(
    private auth: AuthService,
  ) {
    this.authService = auth;
  }


  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }

  logoutUser() {
    this.auth.logout();
  }

  navigateTo(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
