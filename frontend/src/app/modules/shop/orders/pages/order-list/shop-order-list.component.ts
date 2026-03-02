import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopOrderService, ShopOrder } from '../../services/shop-order.service';
import { AuthService } from '@/core/services/http/auth.service';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-shop-order-list',
  standalone: true,
  imports: [
    CommonModule,
    ZardCardComponent,
    ZardBadgeComponent,
    ZardButtonComponent
  ],
  templateUrl: './shop-order-list.component.html',
  styleUrl: './shop-order-list.component.scss'
})
export class ShopOrderListComponent implements OnInit {
  orders: ShopOrder[] = [];
  filteredOrders: ShopOrder[] = [];
  loading = true;
  activeFilter: string = 'all';
  shopId: string = '';

  readonly statusLabels: Record<string, string> = {
    'pending': 'En attente',
    'ready': 'Prêt',
    'picked_up': 'Récupéré',
    'cancelled': 'Annulé'
  };

  readonly statusBadgeTypes: Record<string, string> = {
    'pending': 'secondary',
    'ready': 'default',
    'picked_up': 'outline',
    'cancelled': 'destructive'
  };

  readonly filters = [
    { label: 'Toutes', value: 'all' },
    { label: 'En attente', value: 'pending' },
    { label: 'Prêtes', value: 'ready' },
    { label: 'Récupérées', value: 'picked_up' },
    { label: 'Annulées', value: 'cancelled' },
  ];

  constructor(
    private shopOrderService: ShopOrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const shop = this.authService.getCurrentUserShop();
    if (shop) {
      this.shopId = shop._id;
      this.loadOrders();
    }
  }

  loadOrders() {
    this.loading = true;
    this.shopOrderService.getShopOrders(this.shopId).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes:', error);
        this.loading = false;
      }
    });
  }

  applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.activeFilter);
    }
  }

  setFilter(value: string) {
    this.activeFilter = value;
    this.applyFilter();
  }

  updateStatus(orderId: string, newStatus: string) {
    this.shopOrderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        toast.success(response.message || 'Statut mis à jour.');
        this.loadOrders();
      },
      error: (error) => {
        toast.error(error.error?.message || 'Erreur lors de la mise à jour.');
      }
    });
  }

  getOrderTotal(order: ShopOrder): number {
    return order.items.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0);
  }

  getNextStatus(currentStatus: string): string | null {
    const flow: Record<string, string> = {
      'pending': 'ready',
      'ready': 'picked_up'
    };
    return flow[currentStatus] || null;
  }

  getNextStatusLabel(currentStatus: string): string | null {
    const next = this.getNextStatus(currentStatus);
    return next ? this.statusLabels[next] : null;
  }
}

