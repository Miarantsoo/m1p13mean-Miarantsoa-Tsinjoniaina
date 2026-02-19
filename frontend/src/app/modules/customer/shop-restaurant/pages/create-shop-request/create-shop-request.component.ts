import { Component, OnInit } from '@angular/core';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-create-shop-request',
  standalone: false,
  templateUrl: './create-shop-request.component.html',
  styleUrl: './create-shop-request.component.scss'
})
export class CreateShopRequestComponent implements OnInit {
  shopRequestForm!: FormGroup;
  imageFile: File | null = null;
  loading = false;
  submitted = false;

  constructor(
    private shopRequestService: ShopRequestService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.shopRequestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      coveringLetter: ['', [Validators.required, Validators.minLength(10)]],
      image: [null, Validators.required]
    });
  }

  get f() {
    return this.shopRequestForm.controls;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.shopRequestForm.patchValue({ image: file });
      this.shopRequestForm.get('image')?.updateValueAndValidity();
    }
  }

  submit() {
    this.submitted = true;

    if (this.shopRequestForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.shopRequestForm.value.name);
    formData.append('email', this.shopRequestForm.value.email);
    formData.append('covering_letter', this.shopRequestForm.value.coveringLetter);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.loading = true;

    this.shopRequestService.create(formData).subscribe({
      next: () => {
        this.showSuccesToast()
        this.loading = false;
        this.resetForm();
      },
      error: () => {
        this.showErrorToast()
        this.loading = false;
      }
    });
  }

  showSuccesToast() {
    toast.success('Demande envoyée avec succès', {
      description: 'La demande a été envoyée avec succès et est en cours de traitement.',
      position: "top-right"
    });
  }

  showErrorToast() {
    toast.error('Erreur lors de l\'envoi', {
      description: "L'email inscrit a déjà été utilisé pour une demande de création de boutique",
      position: "top-right"
    })
  }

  resetForm() {
    this.shopRequestForm.reset();
    this.imageFile = null;
    this.submitted = false;
  }
}
