import {Component, HostListener, inject, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ZardSheetService} from '@/shared/components/sheet';
import {PanierSheetComponent} from '@/modules/customer/front-office/components/panier-sheet/panier-sheet.component';
import {CartService} from '@/modules/customer/front-office/services/cart.service';

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
    {label: 'Panier'}
  ];

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private sheetService = inject(ZardSheetService);
  private vcr = inject(ViewContainerRef);
  readonly cartService = inject(CartService);

  ngOnInit() {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 1000);
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
        // TODO : logique de validation de commande
        this.cartService.clear();
      }
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
