import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { SuiviQuotidienInterface } from '../Interfaces/suivi-quotidien.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SuiviQuotidienService {
  private baseUrl: string = environment.SUIVI_QUOTIDIEN_API_URL;

  private suivisQuotidiensUpdated = new Subject<void>();
  suivisQuotidiensUpdated$ = this.suivisQuotidiensUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getSuivisQuotidiens(): Observable<SuiviQuotidienInterface[]> {
    return this.http.get<SuiviQuotidienInterface[]>(`${this.baseUrl}/get/all`);
  }

  getSuiviQuotidienById(id: string): Observable<SuiviQuotidienInterface> {
    return this.http.get<SuiviQuotidienInterface>(`${this.baseUrl}/get/${id}`);
  }

  postSuiviQuotidien(
    suiviQuotidien: SuiviQuotidienInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, suiviQuotidien)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putSuiviQuotidien(
    id: string,
    suiviQuotidien: SuiviQuotidienInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        suiviQuotidien
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteSuiviQuotidien(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifySuivisQuotidiensUpdated() {
    this.suivisQuotidiensUpdated.next();
  }
}
