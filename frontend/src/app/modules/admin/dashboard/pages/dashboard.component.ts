import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  totalShops = 12;
  totalClients = 87;

  monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  shops = [
    {
      name: 'Boutique A',
      rents: {
        2025: ['PAID','PAID','UNPAID','PAID','PAID','PAID','PAID','PAID','PAID','UNPAID','PAID','PAID'],
        2024: Array(12).fill('PAID')
      }
    },
    {
      name: 'Boutique B',
      rents: {
        2025: ['PAID','PARTIAL','UNPAID','PAID','PAID','UNPAID','PAID','PAID','UNPAID','UNPAID','PAID','PAID']
      }
    }
  ];

  currentYear = new Date().getFullYear();
  selectedYear = this.currentYear;

  changeYear(direction: number) {
    const newYear = this.selectedYear + direction;

    if (newYear >= this.currentYear - 1 && newYear <= this.currentYear) {
      this.selectedYear = newYear;
    }
  }


  getYearData(shop: any) {
    return shop.rents[this.selectedYear] || Array(12).fill('UNPAID');
  }

}
