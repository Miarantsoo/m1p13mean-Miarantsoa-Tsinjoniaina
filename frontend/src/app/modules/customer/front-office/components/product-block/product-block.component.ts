import { Component, Input, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion } from '../../models/front-office.model';

@Component({
  selector: 'app-product-block',
  standalone: false,
  templateUrl: './product-block.component.html',
  styleUrl: './product-block.component.scss'
})
export class ProductBlockComponent {
  @Input() productId = '';
  @Input() category = '';
  @Input() imageUrl = '';
  @Input() imageAlt = '';
  @Input() code = '';
  @Input() type = '';
  @Input() price = 0;
  @Input() promotion?: Promotion;

  private router = inject(Router);

  get promoPrice(): number | null {
    if (!this.promotion?.isActive) return null;
    if (this.promotion.discountType === 'percentage') {
      return this.price * (1 - this.promotion.discountValue / 100);
    }
    return Math.max(0, this.price - this.promotion.discountValue);
  }

  get discountLabel(): string {
    if (!this.promotion?.isActive) return '';
    if (this.promotion.discountType === 'percentage') {
      return `-${this.promotion.discountValue}%`;
    }
    return `-${this.promotion.discountValue} MGA`;
  }

  goToDetail(): void {
    if (this.productId) {
      this.router.navigate(['/details', this.productId]);
    }
  }
}
