import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@/modules/customer/front-office/services/cart.service';

@Component({
  selector: 'app-panier-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panier-sheet.component.html',
  styleUrl: './panier-sheet.component.scss'
})
export class PanierSheetComponent {
  readonly cartService = inject(CartService);
}
