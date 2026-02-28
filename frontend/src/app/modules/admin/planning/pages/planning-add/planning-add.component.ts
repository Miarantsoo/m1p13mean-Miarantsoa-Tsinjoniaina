import {Component, inject, OnInit, Optional} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from '@/modules/admin/planning/services/planning.service';
import { Z_MODAL_DATA } from '@/shared/components/dialog';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

export interface iPlanningDialogData {
  id: string;
  date: string;
  time: string;
  duration: string;
}

@Component({
  selector: 'app-planning-add',
  standalone: false,
  templateUrl: './planning-add.component.html',
  styleUrls: ['./planning-add.component.scss']
})
export class PlanningAddComponent implements OnInit {
  planningForm!: FormGroup;
  readonly today = new Date();

  @Optional() private dialogData: iPlanningDialogData = inject(Z_MODAL_DATA, { optional: true });

  constructor(
    private planningService: PlanningService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.planningForm = this.fb.group({
      shop_request: [this.dialogData?.id ?? '', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      duration: [30, [Validators.required, Validators.min(15)]],
    });
  }

  f(name: string) {
    return this.planningForm.get(name);
  }

  verifyForm() {
    if (this.planningForm.invalid) {
      this.planningForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  submit(): Observable<boolean> {
    const { shop_request, date, time, duration } = this.planningForm.value;
    const selectedDate: Date = date instanceof Date ? date : new Date(date);
    const [hours, minutes] = (time as string).split(':').map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(hours, minutes, 0, 0);

    const payload = { shop_request, date: startDate, duration };

    return this.planningService.create(payload).pipe(
      map(() => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
}
