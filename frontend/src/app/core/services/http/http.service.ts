// src/app/core/services/http-base.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environment/environment.development';

export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface HttpRequestConfig {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'pdf';
  withCredentials?: boolean;
  skipAuth?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  protected apiUrl = environment.apiUrl + "/api" || 'http://localhost:3000/api';
  protected endpoint = '';

  constructor(protected http: HttpClient) {}

  protected doRequest<T>(
    url: string,
    method: ApiMethod,
    body?: any,
    config?: HttpRequestConfig
  ): Observable<T> {
    const requestConfig = this.buildConfig(config);

    let request$: Observable<any>;

    switch (method) {
      case ApiMethod.GET:
        request$ = this.http.get(url, requestConfig);
        break;
      case ApiMethod.POST:
        request$ = this.http.post(url, body, requestConfig);
        break;
      case ApiMethod.PUT:
        request$ = this.http.put(url, body, requestConfig);
        break;
      case ApiMethod.PATCH:
        request$ = this.http.patch(url, body, requestConfig);
        break;
      case ApiMethod.DELETE:
        request$ = this.http.delete(url, requestConfig);
        break;
      default:
        throw new Error(`Méthode HTTP non supportée: ${method}`);
    }

    return request$.pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * GET request
   */
  protected doGet<T>(path: string = '', config?: HttpRequestConfig): Observable<T> {
    const url = this.buildUrl(path);
    return this.doRequest<T>(url, ApiMethod.GET, null, config);
  }

  /**
   * POST request
   */
  protected doPost<T>(path: string = '', body?: any, config?: HttpRequestConfig): Observable<T> {
    const url = this.buildUrl(path);
    return this.doRequest<T>(url, ApiMethod.POST, body, config);
  }

  /**
   * PUT request
   */
  protected doPut<T>(path: string = '', body?: any, config?: HttpRequestConfig): Observable<T> {
    const url = this.buildUrl(path);
    return this.doRequest<T>(url, ApiMethod.PUT, body, config);
  }

  /**
   * PATCH request
   */
  protected doPatch<T>(path: string = '', body?: any, config?: HttpRequestConfig): Observable<T> {
    const url = this.buildUrl(path);
    return this.doRequest<T>(url, ApiMethod.PATCH, body, config);
  }

  /**
   * DELETE request
   */
  protected doDelete<T>(path: string = '', config?: HttpRequestConfig): Observable<T> {
    const url = this.buildUrl(path);
    return this.doRequest<T>(url, ApiMethod.DELETE, null, config);
  }

  /**
   * Construit l'URL complète
   */
  protected buildUrl(path: string): string {
    const base = `${this.apiUrl}/${this.endpoint}`;
    if (path.startsWith("?")) {
      return `${base}${path}`;
    }
    return path ? `${base}/${path}` : base;
  }

  /**
   * Construit la configuration de la requête
   */
  private buildConfig(config?: HttpRequestConfig): any {
    return config || {};
  }

  /**
   * Gestion centralisée des erreurs
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = error.error?.message || `Code d'erreur: ${error.status}`;
    }

    console.error('Erreur HTTP:', errorMessage, error);
    return throwError(() => error);
  }
}
