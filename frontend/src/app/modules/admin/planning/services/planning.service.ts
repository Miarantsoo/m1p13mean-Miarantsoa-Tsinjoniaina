import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http/http.service';
import { Observable } from 'rxjs';
import { Planning } from '@/modules/admin/planning/models/planning.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningService extends HttpService {

  protected override endpoint = 'planning';

  getPlannings(): Observable<Planning[]> {
    return this.doGet<Planning[]>('');
  }

  create(data: any): Observable<Planning> {
    return this.doPost<Planning>('', data);
  }

  getById(id: string): Observable<Planning> {
    return this.doGet<Planning>(id);
  }

  update(id: string, data: any): Observable<Planning> {
    return this.doPut<Planning>(id, data);
  }

  delete(id: string): Observable<void> {
    return this.doDelete<void>(id);
  }
}
