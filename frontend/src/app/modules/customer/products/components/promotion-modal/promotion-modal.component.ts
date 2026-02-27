import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'app-promotion-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardCardComponent,
    ZardInputDirective
  ],
  templateUrl: './promotion-modal.component.html',
  styleUrl: './promotion-modal.component.scss'
})
export class PromotionModalComponent implements OnInit {
  @Input() product!: Product;
  @Input() shopId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  promotionForm!: FormGroup;
  submitted = false;
  minDate: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Date minimale = aujourd'hui
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.promotionForm = this.fb.group({
      discountType: ['percentage', Validators.required],
      discountValue: ['', [Validators.required, Validators.min(1)]],
      startDate: [this.minDate, Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    }, {
      validators: this.dateRangeValidator
    });
  }

  dateRangeValidator(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(start) >= new Date(end)) {
      return { invalidDateRange: true };
    }
    return null;
  }

  get f() {
    return this.promotionForm.controls;
  }

  onSubmit() {
    console.log("onSubmit() a été appelée !");

    this.submitted = true;
    console.log("→ onSubmit() appelé");

    if (this.promotionForm.invalid) {
      console.log("Formulaire INVALIDE");
      console.log("Erreurs globales :", this.promotionForm.errors);
      console.log("Erreurs par champ :", this.getAllErrors());
      return;
    }

    console.log("Formulaire VALIDE !");
    const promotionData = {
      ...this.promotionForm.value,
      product: this.product._id,
      shop: this.shopId
    };
    console.log("Données envoyées au parent :", promotionData);

    this.save.emit(promotionData);
  }

  private getAllErrors() {
    const errors: any = {};
    Object.keys(this.promotionForm.controls).forEach(key => {
      const ctrl = this.promotionForm.get(key);
      if (ctrl?.errors) errors[key] = ctrl.errors;
    });
    return errors;
  }

  onClose() {
    this.close.emit();
  }

  getEstimatedPrice(): number {
    const discountType = this.promotionForm.get('discountType')?.value;
    const discountValue = this.promotionForm.get('discountValue')?.value || 0;

    if (discountType === 'percentage') {
      return this.product.price - (this.product.price * discountValue / 100);
    } else {
      return Math.max(0, this.product.price - discountValue);
    }
  }
}
