import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Planning } from './planning.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private API_URL = 'http://localhost:3000/api/planning';

  constructor(private http: HttpClient) {}

  getPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.API_URL);
  }
}
