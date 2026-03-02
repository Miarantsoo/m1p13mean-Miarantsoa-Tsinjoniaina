import {Component, HostListener, inject, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ZardSheetService} from '@/shared/components/sheet';
import {ZardDialogService} from '@/shared/components/dialog';
import {PanierSheetComponent} from '@/modules/customer/front-office/components/panier-sheet/panier-sheet.component';
import {DatePickerDialogComponent} from '@/modules/customer/front-office/components/date-picker-dialog/date-picker-dialog.component';
import {CartService} from '@/modules/customer/front-office/services/cart.service';
import {AuthService} from '@/core/services/http/auth.service';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-front-office-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './front-office-layout.component.html',
  styleUrl: './front-office-layout.component.scss'
})
export class FrontOfficeLayoutComponent implements OnInit, OnDestroy {
  currentTime = '0:00';
  currentYear = new Date().getFullYear();

  menuOpen = false;

  navLinks = [
    {label: 'Accueil', path: '/'},
    {label: 'Boutiques et restaurants', path: '/shops'},
    {label: 'Ouvrir ma boutique', path: '/shop-request/add'},
    {label: 'Panier'}
  ];

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private sheetService = inject(ZardSheetService);
  private dialogService = inject(ZardDialogService);
  private vcr = inject(ViewContainerRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  readonly cartService = inject(CartService);

  ngOnInit() {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 1000);

    // Vérifier si on revient d'un login avec checkout=true
    this.route.queryParams.subscribe(params => {
      if (params['checkout'] === 'true' && this.authService.isAuthenticated()) {
        // Nettoyer les queryParams
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        }).then(() => {
          this.openDatePickerDialog();
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openPanier() {
    this.sheetService.create({
      zContent: PanierSheetComponent,
      zTitle: 'Mon panier',
      zSide: 'right',
      zSize: 'lg',
      zOkText: 'Valider la commande',
      zCancelText: 'Fermer',
      zViewContainerRef: this.vcr,
      zOnOk: () => {
        if (this.cartService.items().length === 0) {
          toast.error('Votre panier est vide.');
          return false;
        }

        if (!this.authService.isAuthenticated()) {
          // Rediriger vers le login avec returnUrl + checkout flag
          const currentUrl = this.router.url.split('?')[0];
          this.router.navigate(['/auth/login'], {
            queryParams: {
              returnUrl: currentUrl,
              checkout: 'true'
            }
          });
          return false;
        }

        // L'utilisateur est connecté → ouvrir le dialog de date
        this.openDatePickerDialog();
        return false;
      }
    });
  }

  private openDatePickerDialog(): void {
    this.dialogService.create({
      zContent: DatePickerDialogComponent,
      zTitle: 'Choisir une date de retrait',
      zDescription: 'Sélectionnez la date à laquelle vous souhaitez récupérer vos articles.',
      zHideFooter: true,
      zWidth: '400px',
      zViewContainerRef: this.vcr,
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const percent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}
