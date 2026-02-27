import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    ZardCardComponent,
    ZardButtonComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() updateStock = new EventEmitter<{ product: Product; stock: number }>();

  expanded = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.product);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.product);
  }

  getImageUrl(): string {
    if (!this.product.photo) {
      return 'https://via.placeholder.com/300?text=No+Image';
    }
    return this.product.photo.startsWith('http')
      ? this.product.photo
      : `http://localhost:3000${this.product.photo}`;
  }

  getStockStatus(): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (this.product.stock === 0) return 'out-of-stock';
    if (this.product.stock < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockLabel(): string {
    const status = this.getStockStatus();
    if (status === 'out-of-stock') return 'Rupture de stock';
    if (status === 'low-stock') return 'Stock faible';
    return 'En stock';
  }
}
