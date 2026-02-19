import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {ShopRequestService} from '@/modules/admin/shop-request/services/shop-request.service';
import {ZardDialogService} from '@/shared/components/dialog';
import { finalize } from 'rxjs/operators';
import {
  iDialogData,
  RejectShopRequestComponent
} from '@/modules/admin/shop-request/components/reject-shop-request/reject-shop-request.component';
import {toast} from 'ngx-sonner';
import {
  iPlanningDialogData,
  PlanningAddComponent
} from '@/modules/admin/planning/pages/planning-add/planning-add.component';

@Component({
  selector: 'app-shop-request-status-list',
  standalone: false,
  templateUrl: './shop-request-status-list.component.html',
  styleUrl: './shop-request-status-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopRequestStatusListComponent implements OnInit {

  @Input() status!: string;
  shopRequests: any[] = [];
  loading = signal(true);
  expandedCards: Set<string> = new Set();
  private dialogService = inject(ZardDialogService);

  Math = Math;

  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = signal(10);
  hasNextPage = signal(false);
  hasPreviousPage = signal(false);

  limitOptions = [5, 10, 20];

  constructor(
    private shopRequestService: ShopRequestService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.shopRequestService
      .getAll(this.status, this.currentPage(), this.limit())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('shop_request response:', response);
          this.shopRequests = response?.data ?? [];
          this.loading.set(false);

          const pagination = response?.pagination;
          if (pagination) {
            this.currentPage.set(pagination.currentPage ?? this.currentPage());
            this.totalPages.set(pagination.totalPages ?? this.totalPages());
            this.totalItems.set(pagination.totalItems ?? this.totalItems());
            this.hasNextPage.set(pagination.hasNextPage ?? this.hasNextPage());
            this.hasPreviousPage.set(pagination.hasPreviousPage ?? this.hasPreviousPage());
          }
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  onLimitChange(newLimit: number): void {
    this.limit.set(newLimit);
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadData();
  }

  toggleExpand(id: string): void {
    if (this.expandedCards.has(id)) {
      this.expandedCards.delete(id);
    } else {
      this.expandedCards.clear();
      this.expandedCards.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedCards.has(id);
  }


  openDialog() {
    console.log(this.expandedCards);
    this.dialogService.create({
      zTitle: 'Voulez-vous rejeter cette demande ?',
      zDescription: `Veuillez entrer la raison du rejet de cette demande, elle sera envoyée directement à la boutique par email.`,
      zContent: RejectShopRequestComponent,
      zData: {
        id: Array.from(this.expandedCards)[0] ?? '',
        reason: ''
      } as iDialogData,
      zCancelText: 'Annuler',
      zOkText: 'Rejeter la demande',
      zOnOk: instance => {
        instance.markAllAsTouched();

        const formData = instance.getFormData();

        if (formData) {
          console.log('Formulaire valide - Données:', formData);
          const data = {
            id: formData.id,
            reason: formData.reason
          }
          this.shopRequestService.rejectDemand(data).subscribe({
            next: () => {
              this.showSuccesToast()
              this.loadData();
            },
            error: () => {
              this.showErrorToast()
            }
          }
          );
          return;
        } else {
          return false;
        }
      },
      zWidth: '800px',
    });
  }

  openPlanningDialog() {
    const dialogRef = this.dialogService.create({
      zTitle: 'Voulez-vous ajouter cette demande au planning ?',
      zDescription: `Veuillez entrer la date, l'heure et la durée prévue pour le planning.`,
      zContent: PlanningAddComponent,
      zData: {
        id: Array.from(this.expandedCards)[0] ?? '',
        date: '',
        time: '',
        duration: ''
      } as iPlanningDialogData,
      zCancelText: 'Annuler',
      zOkText: 'Ajouter au planning',
      zOnOk: instance => {
        if (!instance.verifyForm()) {
          return false;
        }

        instance.submit().subscribe(success => {
          if (success) {
            dialogRef.close();
            this.loadData();
            this.showSuccesPlanningToast();
          } else {
            this.showErrorPlanningToast();
          }
        });

        return false;
      },
      zWidth: '450px',
    });
  }

  showSuccesToast() {
    toast.success('La demande a été rejetée avec succès', {
      description: 'La demande a été rejetée et un email sera transmis à la boutique.',
      position: "top-right"
    });
  }

  showErrorToast() {
    toast.error('Erreur lors du rejet de la demande', {
      description: "La demande n'a pas pu être rejetée, veuillez réessayer.",
      position: "top-right"
    })
  }

  showSuccesPlanningToast() {
    toast.success('La demande a été rajoutée au planning', {
      description: 'La demande a été rajoutée au planning et un email sera transmis à la boutique.',
      position: "top-right"
    });
  }

  showErrorPlanningToast() {
    toast.error('Erreur lors de l\'ajout au planning', {
      description: "La demande n'a pas pu être ajoutée au planning, veuillez réessayer.",
      position: "top-right"
    })
  }
}
