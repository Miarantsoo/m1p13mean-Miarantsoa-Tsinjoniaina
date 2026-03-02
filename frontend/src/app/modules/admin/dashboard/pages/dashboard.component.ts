import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalShops = 0;
  totalClients = 0;
  shops: { name: string; rents: Record<number, string[]> }[] = [];

  monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  currentYear = new Date().getFullYear();
  selectedYear = this.currentYear;

  private rentConfig = [4, 3, 5, 7, 6];

  isLoading = true;
  errorMessage: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService.getDashboardStats().subscribe({
      next: (response: any) => {
        this.totalShops = response.totalShops || 0;
        this.totalClients = response.totalClients || 0;

        // Transformation : on ne garde QUE le nom + on génère les loyers
        this.shops = (response.shps || []).map((shop: any, index: number) => {
          const lastPaidMonth = this.getLastPaidMonthForShop(index);

          return {
            name: shop.name || 'Boutique sans nom',
            rents: {
              2026: this.generateRentArray(lastPaidMonth),
              2027: Array(12).fill('UNPAID')
            }
          };
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
        this.errorMessage = 'Impossible de charger les données.';
        this.isLoading = false;
      }
    });
  }

  private getLastPaidMonthForShop(index: number): number {
    const configIndex = index % this.rentConfig.length;
    const month = this.rentConfig[configIndex];
    return Math.max(0, Math.min(12, month));
  }

  private generateRentArray(lastPaid: number): string[] {
    const arr = Array(12).fill('UNPAID');
    for (let i = 0; i < lastPaid; i++) {
      arr[i] = 'PAID';
    }
    return arr;
  }

  changeYear(direction: number) {
    const newYear = this.selectedYear + direction;
    if (newYear >= this.currentYear - 2 && newYear <= this.currentYear + 1) {
      this.selectedYear = newYear;
    }
  }

  getYearData(shop: any): string[] {
    return shop.rents[this.selectedYear] || Array(12).fill('UNPAID');
  }
}
