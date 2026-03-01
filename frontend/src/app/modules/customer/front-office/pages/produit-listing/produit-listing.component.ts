import { Component, computed, signal, HostListener, ElementRef, inject } from '@angular/core';

interface Product {
  category: string;
  imageUrl: string;
  imageAlt: string;
  code: string;
  type: string;
  price: number;
}

const PAGE_SIZE = 10;

@Component({
  selector: 'app-produit-listing',
  standalone: false,
  templateUrl: './produit-listing.component.html',
  styleUrl: './produit-listing.component.scss'
})
export class ProduitListingComponent {
  private elRef = inject(ElementRef);

  shopName = "Global";
  categories: string[] = ['All', 'Skincare', 'Sunscreen', 'Body', 'Face'];

  products: Product[] = [
    { category: 'Sunscreen', imageUrl: 'assets/images/product-1.jpg', imageAlt: 'Oh My Bod SPF50',      code: 'OMB-50', type: 'SPF50 Body',        price: 28 },
    { category: 'Skincare',  imageUrl: 'assets/images/product-2.jpg', imageAlt: 'Resting Beach Face',   code: 'RBF-30', type: 'SPF30 Face',        price: 34 },
    { category: 'Body',      imageUrl: 'assets/images/product-3.jpg', imageAlt: 'In A Good Light',      code: 'IGL-40', type: 'Tinted SPF40',      price: 22 },
    { category: 'Sunscreen', imageUrl: 'assets/images/product-4.jpg', imageAlt: 'Rose From Above',      code: 'RFA-50', type: 'SPF50 Mist',        price: 19 },
    { category: 'Face',      imageUrl: 'assets/images/product-5.jpg', imageAlt: 'Off Duty Moisturizer', code: 'ODM-15', type: 'SPF15 Face',        price: 41 },
    { category: 'Body',      imageUrl: 'assets/images/product-6.jpg', imageAlt: 'Skin Saver Gel',       code: 'SSG-25', type: 'Aloe Body Gel',     price: 16 },
    { category: 'Skincare',  imageUrl: 'assets/images/product-2.jpg', imageAlt: 'Glow Serum',           code: 'GLS-10', type: 'Vitamin C Serum',  price: 55 },
    { category: 'Sunscreen', imageUrl: 'assets/images/product-1.jpg', imageAlt: 'Sun Shield',           code: 'SSH-60', type: 'SPF60 Sport',       price: 30 },
    { category: 'Face',      imageUrl: 'assets/images/product-5.jpg', imageAlt: 'Night Repair',         code: 'NRP-00', type: 'Night Cream',       price: 48 },
    { category: 'Body',      imageUrl: 'assets/images/product-3.jpg', imageAlt: 'Hydra Lotion',         code: 'HYL-20', type: 'Body Lotion',       price: 14 },
    { category: 'Face',      imageUrl: 'assets/images/product-5.jpg', imageAlt: 'Clay Mask',            code: 'CLM-05', type: 'Detox Mask',        price: 26 },
    { category: 'Skincare',  imageUrl: 'assets/images/product-2.jpg', imageAlt: 'Retinol Boost',        code: 'RTB-01', type: 'Retinol Serum',    price: 62 },
  ];

  readonly maxPriceLimit = Math.max(...this.products.map(p => p.price));

  // --- Filter state ---
  searchQuery  = signal('');
  activeCategory = signal('All');
  priceMin     = signal(0);
  priceMax     = signal(this.maxPriceLimit);
  filterOpen   = signal(false);

  // --- Pagination state ---
  currentPage  = signal(1);
  pageSize     = PAGE_SIZE;

  // --- Computed ---
  filteredProducts = computed(() => {
    const q   = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();
    const min = this.priceMin();
    const max = this.priceMax();

    return this.products.filter(p =>
      (cat === 'All' || p.category === cat) &&
      p.price >= min && p.price <= max &&
      (!q || p.imageAlt.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    );
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)));

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  // --- Methods ---
  setCategory(cat: string): void {
    this.activeCategory.set(cat);
    this.currentPage.set(1);
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onPriceMinChange(value: number): void {
    if (value > this.priceMax()) { this.priceMin.set(this.priceMax()); return; }
    this.priceMin.set(value);
    this.currentPage.set(1);
  }

  onPriceMaxChange(value: number): void {
    if (value < this.priceMin()) { this.priceMax.set(this.priceMin()); return; }
    this.priceMax.set(value);
    this.currentPage.set(1);
  }

  toggleFilter(): void {
    this.filterOpen.update(v => !v);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  resetFilters(): void {
    this.activeCategory.set('All');
    this.priceMin.set(0);
    this.priceMax.set(this.maxPriceLimit);
    this.currentPage.set(1);
  }

  get hasActiveFilters(): boolean {
    return this.activeCategory() !== 'All' || this.priceMin() > 0 || this.priceMax() < this.maxPriceLimit;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (this.filterOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.filterOpen.set(false);
    }
  }
}
