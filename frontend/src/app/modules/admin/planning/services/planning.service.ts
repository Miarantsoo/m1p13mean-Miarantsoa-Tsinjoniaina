import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Planning} from '@/modules/admin/planning/models/planning.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private API_URL = 'http://localhost:3000/api/planning';

  constructor(private http: HttpClient) {}

  getPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.API_URL);
  }

  create(data: any) {
    return this.http.post(this.API_URL, data);
  }

}
