import { Component, OnInit } from '@angular/core';
import { ShopDashboardService, ShopDashboardData } from '../services/shop-dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-dashboard.component.html',
  styleUrls: ['./shop-dashboard.component.scss']
})
export class ShopDashboardComponent implements OnInit {

  dashboardData: ShopDashboardData | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  // Pour afficher le shopId (à récupérer depuis un service auth ou route)
  shopId = '69a4fb5875d3410ae34233ea'; // ← À remplacer par le vrai shopId (ex: depuis auth)

  constructor(private dashboardService: ShopDashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService.getDashboard(this.shopId).subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData = response.data;
        } else {
          this.errorMessage = 'Erreur lors du chargement des données';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur dashboard:', err);
        this.errorMessage = 'Impossible de charger le tableau de bord';
        this.isLoading = false;
      }
    });
  }

  // Helpers pour l’affichage
  getTopProducts() {
    return this.dashboardData?.topProductsGlobal || [];
  }

  getTopByCategory() {
    return this.dashboardData?.topProductsByCategory || [];
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('fr-MG') + ' Ar';
  }
}
