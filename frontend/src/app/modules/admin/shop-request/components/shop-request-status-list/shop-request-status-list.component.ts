import {Component, Input, OnInit} from '@angular/core';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shop-request-status-list',
  standalone: false,
  templateUrl: './shop-request-status-list.component.html',
  styleUrl: './shop-request-status-list.component.scss'
})
export class ShopRequestStatusListComponent implements OnInit {

  @Input() status!: string;
  shopRequests: any[] = [];
  loading = true;
  expandedCards: Set<string> = new Set();

  constructor(
    private shopRequestService: ShopRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.shopRequestService.getAll(this.status).subscribe({
      next: (data) => {
        console.log('shop_request:', data);
        this.shopRequests = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToPlanning(shopRequestId: string) {
    this.router.navigate(
      ['/planning/add'],
      { queryParams: { shop_request: shopRequestId } }
    );
  }

  toggleExpand(id: string): void {
    if (this.expandedCards.has(id)) {
      this.expandedCards.delete(id);
    } else {
      this.expandedCards.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedCards.has(id);
  }
}
