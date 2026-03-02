import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http/http.service';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalShops: number;
  totalClients: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends HttpService {
  protected override endpoint = 'dashboard-admin';

  getDashboardStats(): Observable<DashboardStats> {
    return this.doGet<DashboardStats>('');
  }
}
