import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';
import {ZardDialogService} from '@/shared/components/dialog';
import { finalize } from 'rxjs/operators';
import {
  iDialogData,
  RejectShopRequestComponent
} from '@/modules/admin/shop-request/components/reject-shop-request/reject-shop-request.component';
import {toast} from 'ngx-sonner';
import {
  iPlanningDialogData,
  PlanningAddComponent
} from '@/modules/admin/planning/pages/planning-add/planning-add.component';

@Component({
  selector: 'app-shop-request-status-list',
  standalone: false,
  templateUrl: './shop-request-status-list.component.html',
  styleUrl: './shop-request-status-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopRequestStatusListComponent implements OnInit {

  @Input() status!: string;
  shopRequests: any[] = [];
  loading = signal(true);
  expandedCards: Set<string> = new Set();
  private dialogService = inject(ZardDialogService);

  Math = Math;

  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = signal(10);
  hasNextPage = signal(false);
  hasPreviousPage = signal(false);

  limitOptions = [5, 10, 20];

  constructor(
    private shopRequestService: ShopRequestService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.shopRequestService
      .getAll(this.status, this.currentPage(), this.limit())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('shop_request response:', response);
          this.shopRequests = response?.data ?? [];
          this.loading.set(false);

          const pagination = response?.pagination;
          if (pagination) {
            this.currentPage.set(pagination.currentPage ?? this.currentPage());
            this.totalPages.set(pagination.totalPages ?? this.totalPages());
            this.totalItems.set(pagination.totalItems ?? this.totalItems());
            this.hasNextPage.set(pagination.hasNextPage ?? this.hasNextPage());
            this.hasPreviousPage.set(pagination.hasPreviousPage ?? this.hasPreviousPage());
          }
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  onLimitChange(newLimit: number): void {
    this.limit.set(newLimit);
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  toggleExpand(id: string): void {
    if (this.expandedCards.has(id)) {
      this.expandedCards.delete(id);
    } else {
      this.expandedCards.clear();
      this.expandedCards.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedCards.has(id);
  }
}
