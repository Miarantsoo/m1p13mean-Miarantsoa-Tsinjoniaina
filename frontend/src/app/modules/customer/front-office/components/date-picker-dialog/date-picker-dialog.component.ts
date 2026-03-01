import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardCalendarComponent } from '@/shared/components/calendar';
import { ZardDialogRef } from '@/shared/components/dialog';
import { ZardButtonComponent } from '@/shared/components/button';
import { CartService } from '@/modules/customer/front-office/services/cart.service';
import { OrderService } from '@/modules/customer/front-office/services/order.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-date-picker-dialog',
  standalone: true,
  imports: [CommonModule, ZardCalendarComponent, ZardButtonComponent],
  template: `
    <div class="date-picker-dialog">
      <p class="date-picker-dialog__description">
        Choisissez une date de retrait pour vos articles.<br/>
        <strong>Maximum 10 jours après aujourd'hui.</strong>
      </p>

      <z-calendar
        zMode="single"
        [minDate]="minDate"
        [maxDate]="maxDate"
        (dateChange)="onDateSelected($event)"
      />

      @if (selectedDate()) {
        <p class="date-picker-dialog__selected">
          Date sélectionnée : <strong>{{ selectedDate() | date:'dd/MM/yyyy' }}</strong>
        </p>
      }

      <div class="date-picker-dialog__actions">
        <button z-button zType="outline" (click)="onCancel()" [disabled]="isLoading()">Annuler</button>
        <button z-button [disabled]="!selectedDate() || isLoading()" (click)="onConfirm()">
          @if (isLoading()) {
            Traitement...
          } @else {
            Confirmer la commande
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .date-picker-dialog {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0.5rem 0;

      &__description {
        font-size: 0.9rem;
        color: #555;
        line-height: 1.5;
      }

      &__selected {
        font-size: 0.9rem;
        color: #333;
        text-align: center;
        padding: 0.5rem;
        background: #f5f5f5;
        border-radius: 6px;
      }

      &__actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding-top: 0.5rem;
      }
    }
  `]
})
export class DatePickerDialogComponent {
  private dialogRef = inject(ZardDialogRef);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);

  selectedDate = signal<Date | null>(null);
  isLoading = signal(false);

  minDate: Date;
  maxDate: Date;

  constructor() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.minDate = tomorrow;

    const max = new Date();
    max.setDate(max.getDate() + 10);
    max.setHours(23, 59, 59, 999);
    this.maxDate = max;
  }

  onDateSelected(date: Date | Date[]): void {
    if (date instanceof Date) {
      this.selectedDate.set(date);
    } else if (Array.isArray(date) && date.length > 0) {
      this.selectedDate.set(date[0]);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    const pickupDate = this.selectedDate();
    if (!pickupDate) return;

    const items = this.cartService.getItemsForApi();
    if (items.length === 0) {
      toast.error('Votre panier est vide.');
      return;
    }

    this.isLoading.set(true);

    this.orderService.createOrder({
      items,
      pickupDate: pickupDate.toISOString()
    }).subscribe({
      next: (response) => {
        toast.success(response.message || 'Commande(s) créée(s) avec succès !');
        this.cartService.clear();
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (error) => {
        const msg = error.error?.message || 'Erreur lors de la création de la commande.';
        toast.error(msg);
        this.isLoading.set(false);
      }
    });
  }
}


