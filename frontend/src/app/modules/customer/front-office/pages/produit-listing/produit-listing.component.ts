import { Component, computed, signal, HostListener, ElementRef, inject, OnInit } from '@angular/core';
import { Product, Category } from '@/modules/customer/front-office/models/front-office.model';
import { ProductService } from '@/modules/customer/front-office/services/product.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-produit-listing',
  standalone: false,
  templateUrl: './produit-listing.component.html',
  styleUrl: './produit-listing.component.scss'
})
export class ProduitListingComponent implements OnInit {
  private elRef = inject(ElementRef);
  private productService = inject(ProductService);

  shopName = "Global";
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(false);

  readonly maxPriceLimit = computed(() => {
    const prices = this.products().map(p => p.price);
    return prices.length > 0 ? Math.max(...prices) : 100;
  });

  // --- Filter state ---
  searchQuery  = signal('');
  activeCategoryId = signal<string | null>(null);
  priceMin     = signal(0);
  priceMax     = signal(100);
  filterOpen   = signal(false);

  // --- Pagination state ---
  currentPage  = signal(1);
  pageSize     = PAGE_SIZE;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories.set([{ _id: 'all', name: 'All' } as Category, ...response.data]);
      },
      error: (err) => console.error('Erreur chargement catégories:', err)
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const filters = {
      categoryId: this.activeCategoryId() || undefined,
      search: this.searchQuery() || undefined,
      available: true,
      page: 1,
      limit: 1000
    };

    this.productService.getAllProducts(filters).subscribe({
      next: (response) => {
        this.products.set(response.data ?? []);
        this.isLoading.set(false);
        const prices = (response.data ?? []).map(p => p.price);
        if (prices.length > 0) {
          this.priceMax.set(Math.max(...prices));
        }
      },
      error: (err) => {
        console.error('Erreur chargement produits:', err);
        this.isLoading.set(false);
      }
    });
  }

  // --- Computed ---
  filteredProducts = computed(() => {
    const q   = this.searchQuery().toLowerCase().trim();
    const catId = this.activeCategoryId();
    const min = this.priceMin();
    const max = this.priceMax();

    return this.products().filter(p => {
      const categoryMatch = !catId || catId === 'all' ||
        (typeof p.category === 'object' ? p.category._id === catId : p.category === catId);
      const priceMatch = p.price >= min && p.price <= max;
      const searchMatch = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription?.toLowerCase().includes(q) || false);

      return categoryMatch && priceMatch && searchMatch;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)));

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  // --- Methods ---
  setCategory(catId: string | null): void {
    this.activeCategoryId.set(catId === 'all' ? null : catId);
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
    this.activeCategoryId.set(null);
    this.priceMin.set(0);
    this.priceMax.set(this.maxPriceLimit());
    this.currentPage.set(1);
  }

  get hasActiveFilters(): boolean {
    return this.activeCategoryId() !== null || this.priceMin() > 0 || this.priceMax() < this.maxPriceLimit();
  }

  getCategoryName(product: Product): string {
    return typeof product.category === 'object' ? product.category.name : 'Sans catégorie';
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (this.filterOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.filterOpen.set(false);
    }
  }
}
