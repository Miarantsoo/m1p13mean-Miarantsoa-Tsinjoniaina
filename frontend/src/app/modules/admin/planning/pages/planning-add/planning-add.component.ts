import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PlanningService} from '@/modules/admin/planning/services/planning.service';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';

@Component({
  selector: 'app-planning-add',
  standalone: false,
  templateUrl: './planning-add.component.html',
  styleUrls: ['./planning-add.component.scss']
})
export class PlanningAddComponent implements OnInit {

  shopRequests: any[] = [];

  shop_request = '';
  date = '';
  time = '';
  duration = 60;
  loading = false;

  constructor(
    private planningService: PlanningService,
    private shopRequestService: ShopRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.shopRequestService.getAll().subscribe(data => {
      this.shopRequests = data;
    });

    this.route.queryParams.subscribe(params => {
      if (params['shop_request']) {
        this.shop_request = params['shop_request'];
      }
    });
  }

  submit() {
    const startDate = new Date(`${this.date}T${this.time}`);

    const payload = {
      shop_request: this.shop_request,
      date: startDate,
      duration: this.duration
    };

    this.loading = true;

    this.planningService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/planning']);
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
