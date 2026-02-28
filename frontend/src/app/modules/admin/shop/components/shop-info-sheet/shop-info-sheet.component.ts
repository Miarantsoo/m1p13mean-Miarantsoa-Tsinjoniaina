import {ChangeDetectorRef, Component, inject, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Z_SHEET_DATA, ZardSheetRef} from '@/shared/components/sheet';
import {ShopSlot} from '@/modules/admin/shop/models/shop.model';
import {ShopRequest} from '@/modules/admin/shop-request/models/shop-request.model';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';
import {ShopAdminService} from '@/modules/admin/shop/services/shop-admin.service';


@Component({
  selector: 'app-shop-info-sheet',
  standalone: false,
  templateUrl: './shop-info-sheet.component.html',
  styleUrl: './shop-info-sheet.component.scss',
})
export class ShopInfoSheetComponent implements OnInit {
  private shopRequestService = inject(ShopRequestService);
  private shopAdminService = inject(ShopAdminService);
  private sheetRef = inject(ZardSheetRef);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  readonly shopSlot = inject<ShopSlot>(Z_SHEET_DATA);

  selectedColor = '#e45a33';

  readonly presetColors = [
    '#e45a33', '#fa761e', '#ef486e',
    '#4488ff', '#ff44aa', '#ffd165',
    '#fde84e', '#9ac53e', '#05d59e',
    '#5bbfea', '#1089b1', '#06394a',
  ];

  shopRequestPending: ShopRequest[] = [];
  selectedRequest: ShopRequest | null = null;
  assigning = false;

  managerForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone_number: ['', [Validators.required]],
  });

  constructor(public vcRef: ViewContainerRef) {}

  ngOnInit() {
    this.getPendingShopRequest();
  }

  private getPendingShopRequest() {
    this.shopRequestService.getAll('pending', 1, 100).subscribe(res => {
      this.shopRequestPending = res.data;
      this.cdr.detectChanges();
    });
  }

  selectRequest(request: ShopRequest) {
    this.selectedRequest = request;
    this.managerForm.patchValue({
      email: request.email,
      first_name: request.name,
    });
  }

  backToList() {
    this.selectedRequest = null;
    this.managerForm.reset();
    this.selectedColor = '#e45a33';
  }

  submitAssignment() {
    if (this.assigning || !this.selectedRequest?._id || this.managerForm.invalid) return;
    this.assigning = true;

    const manager = {
      ...this.managerForm.value,
      phone_number: this.formatPhone(this.managerForm.value.phone_number ?? ''),
      role: 'shop' as const,
    };

    this.shopAdminService.assignShop(this.shopSlot._id, this.selectedRequest._id, manager, this.selectedColor).subscribe({
      next: () => {
        this.sheetRef.close({assigned: true});
      },
      error: () => {
        this.assigning = false;
      },
    });
  }

  private formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('261')) return '+' + cleaned;
    if (cleaned.startsWith('0')) return '+261' + cleaned.substring(1);
    return '+261' + cleaned;
  }
}
