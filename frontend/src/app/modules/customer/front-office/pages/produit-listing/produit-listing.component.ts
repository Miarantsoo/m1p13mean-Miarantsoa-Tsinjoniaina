import { Component } from '@angular/core';

interface Product {
  category: string;
  imageUrl: string;
  imageAlt: string;
  code: string;
  type: string;
}

@Component({
  selector: 'app-produit-listing',
  standalone: false,
  templateUrl: './produit-listing.component.html',
  styleUrl: './produit-listing.component.scss'
})
export class ProduitListingComponent {
  filters: string[] = ['All', 'Skincare', 'Sunscreen', 'Body', 'Face'];
  activeFilter = 'All';

  products: Product[] = [
    {
      category: 'Sunscreen',
      imageUrl: 'assets/images/product-1.jpg',
      imageAlt: 'Oh My Bod SPF50',
      code: 'OMB-50',
      type: 'SPF50 Body',
    },
    {
      category: 'Skincare',
      imageUrl: 'assets/images/product-2.jpg',
      imageAlt: 'Resting Beach Face',
      code: 'RBF-30',
      type: 'SPF30 Face',
    },
    {
      category: 'Body',
      imageUrl: 'assets/images/product-3.jpg',
      imageAlt: 'In A Good Light',
      code: 'IGL-40',
      type: 'Tinted SPF40',
    },
    {
      category: 'Sunscreen',
      imageUrl: 'assets/images/product-4.jpg',
      imageAlt: 'Rose From Above',
      code: 'RFA-50',
      type: 'SPF50 Mist',
    },
    {
      category: 'Face',
      imageUrl: 'assets/images/product-5.jpg',
      imageAlt: 'Off Duty Moisturizer',
      code: 'ODM-15',
      type: 'SPF15 Face',
    },
    {
      category: 'Body',
      imageUrl: 'assets/images/product-6.jpg',
      imageAlt: 'Skin Saver Gel',
      code: 'SSG-25',
      type: 'Aloe Body Gel',
    },
  ];

  get filteredProducts(): Product[] {
    if (this.activeFilter === 'All') {
      return this.products;
    }
    return this.products.filter((p) => p.category === this.activeFilter);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }
}
