import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/product.model';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardInputDirective
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  imageFile: File | null = null;
  imagePreview: string | null = null;
  submitted = false;
  loading = false;
  isEditMode = false;
  productId: string | null = null;
  shopId = '69a0016ce198485ddf628ca1';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadCategories();

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      photo: ['']
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        const product = response.data as Product;
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          shortDescription: product.shortDescription,
          stock: product.stock,
          category: typeof product.category === 'object' ? product.category._id : product.category
        });

        if (product.photo) {
          this.imagePreview = product.photo.startsWith('http')
            ? product.photo
            : `http://localhost:3000${product.photo}`;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du produit:', error);
        alert('Erreur lors du chargement du produit');
        this.router.navigate(['/shop/products']);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);

      this.productForm.patchValue({ photo: this.imageFile.name });
    }
  }

  get f() {
    return this.productForm.controls;
  }

  submit() {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    if (!this.isEditMode && !this.imageFile) {
      alert('Veuillez sélectionner une image');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('price', this.productForm.value.price);
    formData.append('shortDescription', this.productForm.value.shortDescription);
    formData.append('stock', this.productForm.value.stock);
    formData.append('shop', this.shopId);
    formData.append('category', this.productForm.value.category);

    if (this.imageFile) {
      formData.append('photo', this.imageFile);
    }

    console.log("FD:"+formData);

    const request = this.isEditMode
      ? this.productService.updateProduct(this.productId!, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: (response) => {
        alert(this.isEditMode ? 'Produit modifié avec succès' : 'Produit créé avec succès');
        this.router.navigate(['/shop/products']);
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue');
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/shop/products']);
  }
}
