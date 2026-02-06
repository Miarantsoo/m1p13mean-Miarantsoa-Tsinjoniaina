import { Component } from '@angular/core';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';

@Component({
  selector: 'app-shop-request',
  templateUrl: './shop-request.component.html',
  styleUrls: ['./shop-request.component.scss']
})
export class ShopRequestComponent {

  name = '';
  email = '';
  coveringLetter = '';
  imageFile: File | null = null;
  loading = false;
  successMessage = '';

  constructor(private shopRequestService: ShopRequestService) {}

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  submit() {

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('covering_letter', this.coveringLetter);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.loading = true;

    this.shopRequestService.create(formData).subscribe({
      next: () => {
        this.successMessage = 'Demande envoyée avec succès';
        this.loading = false;
        this.resetForm();
      },
      error: () => {
        alert('Erreur lors de l’envoi');
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.coveringLetter = '';
    this.imageFile = null;
  }
}
