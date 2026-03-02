import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from '@/modules/customer/front-office/models/front-office.model';
import { ShopService } from '@/modules/customer/front-office/services/shop.service';

@Component({
  selector: 'app-shop-list',
  standalone: false,
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss'
})
export class ShopListComponent implements OnInit {
  private shopService = inject(ShopService);
  private router = inject(Router);

  shops = signal<Shop[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.isLoading.set(true);
    this.shopService.getAllShops().subscribe({
      next: (shops) => {
        this.shops.set(shops);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement boutiques:', err);
        this.isLoading.set(false);
      }
    });
  }

  goToShop(shop: Shop): void {
    this.router.navigate(['/shops', shop._id]);
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}

