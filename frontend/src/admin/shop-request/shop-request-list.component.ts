import { Component, OnInit } from '@angular/core';
import { ShopRequestService } from './shop-request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shop-request-list',
  templateUrl: './shop-request-list.component.html',
  styleUrls: ['./shop-request-list.component.scss']
})
export class ShopRequestListComponent implements OnInit {

  shopRequests: any[] = [];
  loading = true;

  constructor(
    private shopRequestService: ShopRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shopRequestService.getAll().subscribe({
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
}
