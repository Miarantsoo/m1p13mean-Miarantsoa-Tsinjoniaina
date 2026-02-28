import {Component, inject, type AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Z_MODAL_DATA} from '@/shared/components/dialog';

export interface iDialogData {
  id: string;
  reason: string;
}

@Component({
  selector: 'app-reject-shop-request',
  standalone: false,
  templateUrl: './reject-shop-request.component.html',
  styleUrl: './reject-shop-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogBasic'
})
export class RejectShopRequestComponent implements AfterViewInit {
  private zData: iDialogData = inject(Z_MODAL_DATA);

  form = new FormGroup({
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }


  getFormData(): iDialogData | null {
    if (this.form.valid) {
      return {
        id: this.zData?.id || '',
        reason: this.form.value.reason || ''
      };
    }
    return null;
  }


  getRawFormData(): iDialogData {
    return {
      id: this.zData?.id || '',
      reason: this.form.value.reason || ''
    };
  }


  isFormValid(): boolean {
    return this.form.valid;
  }


  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

}
